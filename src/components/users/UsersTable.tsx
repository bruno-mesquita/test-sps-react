import { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Pencil, Trash2, Paperclip } from "lucide-react";

interface UsersTableProps {
  users: User[];
  onDelete: (id: number) => Promise<void>;
}

function UsersTable({ users, onDelete }: UsersTableProps) {
  const [photoUser, setPhotoUser] = useState<User | null>(null);

  if (users.length === 0) {
    return (
      <div className="rounded-lg border bg-card py-12 text-center text-muted-foreground">
        Nenhum usuário encontrado.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="w-24">Anexos</TableHead>
              <TableHead className="w-28 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => user.originalUrl && setPhotoUser(user)}
                    className={cn(
                      "focus:outline-none",
                      user.originalUrl && "cursor-pointer"
                    )}
                    disabled={!user.originalUrl}
                  >
                    <Avatar>
                      {user.previewUrl && (
                        <AvatarImage src={user.previewUrl} alt={user.name} />
                      )}
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </button>
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.type === "admin" ? "default" : "secondary"}>
                    {user.type === "admin" ? "Admin" : "Usuário"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {(user.attachments?.length ?? 0) > 0 && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Paperclip className="h-3 w-3" />
                      {user.attachments!.length}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
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
                            Deseja excluir <strong>{user.name}</strong>? Esta ação não pode
                            ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(user.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
    </>
  );
}

export default UsersTable;
