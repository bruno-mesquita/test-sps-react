import { useState } from "react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Pencil, Paperclip } from "lucide-react";
import DeleteUserDialog from "./DeleteUserDialog";
import PhotoDialog from "./PhotoDialog";
import type { UserWithAttachmentsCount } from "@/queries/users";

interface UsersTableProps {
  users: UserWithAttachmentsCount[];
}

type PhotoUser = { src: string; alt:  string; }

function UsersTable({ users }: UsersTableProps) {
  const [photoUser, setPhotoUser] = useState<PhotoUser | null>(null);

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
                    onClick={() => user.originalUrl && setPhotoUser({ src: user.originalUrl, alt: user.name })}
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
                  {user.attachmentCount > 0 && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Paperclip className="h-3 w-3" />
                      {user.attachmentCount}
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
                    <DeleteUserDialog userId={user.id} username={user.name} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PhotoDialog src={photoUser?.src ?? null} alt={photoUser?.alt ?? ""} onClose={() => setPhotoUser(null)} />
    </>
  );
}

export default UsersTable;
