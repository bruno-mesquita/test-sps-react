import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserService from "@/services/UserService";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  UserPlus,
  LogOut,
  Pencil,
  Trash2,
  Loader2,
  Paperclip,
  Users as UsersIcon,
} from "lucide-react";

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photoUser, setPhotoUser] = useState<User | null>(null);

  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    UserService.list()
      .then(async (res) => {
        const users = res.data;
        const attachmentLists = await Promise.all(
          users.map((u) =>
            api.get(`/users/${u.id}/attachments`).then((r) => r.data).catch(() => [])
          )
        );
        setUsers(users.map((u, i) => ({ ...u, attachments: attachmentLists[i] })));
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold">Usuários</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => navigate("/users/new")}>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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
          <div className="rounded-lg border bg-card">
            {users.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                Nenhum usuário encontrado.
              </div>
            ) : (
              <ul className="divide-y">
                {users.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => user.originalUrl && setPhotoUser(user)}
                        className={cn("focus:outline-none", user.originalUrl && "cursor-pointer")}
                        disabled={!user.originalUrl}
                      >
                        <Avatar>
                          {user.previewUrl && (
                            <AvatarImage src={user.previewUrl} alt={user.name} />
                          )}
                          <AvatarFallback>
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                        {(user.attachments?.length ?? 0) > 0 && (
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Paperclip className="h-3 w-3" />
                            {user.attachments!.length} anexo{user.attachments!.length !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/users/${user.id}`}
                        className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="ml-1 hidden sm:inline">Editar</span>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            />
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-1 hidden sm:inline">Excluir</span>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
                            <AlertDialogDescription>
                              Deseja excluir <strong>{user.name}</strong>? Esta
                              ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(user.id)}
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>

      <Dialog open={photoUser !== null} onOpenChange={(open) => !open && setPhotoUser(null)}>
        <DialogContent className="sm:max-w-lg">
          {photoUser && (
            <img
              src={photoUser.originalUrl}
              alt={photoUser.name}
              className="w-full rounded-lg object-contain max-h-[70vh]"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Users;
