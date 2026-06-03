import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "@/services/UserService";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus, LogOut } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UsersTable from "@/components/users/UsersTable";

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    UserService.list()
      .then(async (res) => {
        const list: User[] = res.data;
        const attachmentLists = await Promise.all(
          list.map((u) =>
            api.get(`/users/${u.id}/attachments`).then((r) => r.data).catch(() => [])
          )
        );
        setUsers(list.map((u, i) => ({ ...u, attachments: attachmentLists[i] })));
      })
      .catch(() => setError("Falha ao carregar usuários."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await UserService.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setError("Erro ao excluir usuário.");
    }
  };

  const headerActions = (
    <>
      <Button size="sm" onClick={() => navigate("/users/new")}>
        <UserPlus className="mr-2 h-4 w-4" />
        Novo Usuário
      </Button>
      <Button variant="outline" size="sm" onClick={signOut}>
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Usuários" actions={headerActions} />
      <main className="container mx-auto px-4 py-8 flex-1">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!loading && !error && (
          <UsersTable users={users} onDelete={handleDelete} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Users;
