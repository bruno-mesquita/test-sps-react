import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus, LogOut, RefreshCw } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UsersTable from "@/components/users/UsersTable";
import { useUsers } from "@/hooks/useUsers";
import { useDeleteUser } from "@/hooks/useUserMutations";

function Users() {
  const { data: users = [], isLoading, isError, isFetching, refetch } = useUsers();
  const { mutate: deleteUser } = useDeleteUser();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const headerActions = (
    <>
      {isFetching && !isLoading && (
        <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
      )}
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
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {isError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription className="flex items-center justify-between">
              <span>Falha ao carregar usuários.</span>
              <Button variant="ghost" size="sm" onClick={() => refetch()}>
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}
        {!isLoading && !isError && (
          <UsersTable users={users} onDelete={deleteUser} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Users;
