import { useNavigate, useParams } from "react-router-dom";
import { UserAttachment } from "@/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UserForm, { UserFormValues } from "@/components/users/UserForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUsers";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { useRemovePhoto } from "@/hooks/useRemovePhoto";
import { useDeleteAttachment } from "@/hooks/useDeleteAttachment";
import { useUploadAttachments } from "@/hooks/useUploadAttachments";

function UserEdit() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading } = useUser(userId!);

  const { mutateAsync: updateUser, isPending: saving, error: saveError } = useUpdateUser();
  const { mutateAsync: removePhoto } = useRemovePhoto();
  const { mutateAsync: deleteAttachment } = useDeleteAttachment();
  const { mutateAsync: uploadAttachments } = useUploadAttachments();

  const handleSubmit = async ({ newAttachments, ...data }: UserFormValues) => {
    await updateUser({ id: userId!, ...data });

    if (newAttachments.length > 0) {
      const attachmentData = new FormData();
      newAttachments.forEach((file) => attachmentData.append("files", file));
      await uploadAttachments({ userId: userId!, formData: attachmentData });
    }

    navigate("/users");
  };

  const handleRemovePhoto = () => removePhoto(userId!);

  const handleDeleteAttachment = (attachmentId: string) =>
    deleteAttachment({ userId: userId!, attachmentId });

  const handleNavigateToAttachment = (att: UserAttachment) => {
    navigate(`/users/${userId}/attachments/${att.id}`, {
      state: { filename: att.filename, url: att.url },
    });
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header title="Editar Usuário" onBack={() => navigate("/users")} />
        <main className="container mx-auto px-4 py-8 max-w-md flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Editar Usuário" onBack={() => navigate("/users")} />
      <main className="container mx-auto px-4 py-8 max-w-md flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Atualizar usuário</CardTitle>
            <CardDescription>Altere os dados do usuário.</CardDescription>
          </CardHeader>
          <CardContent>
            <UserForm
              defaultValues={{
                name: user.name,
                email: user.email,
                isAdmin: user.type === "admin",
                photoPreview: user.previewUrl ?? null,
                existingAttachments: user.attachments,
              }}
              onSubmit={handleSubmit}
              isNew={false}
              loading={saving}
              error={saveError ? "Erro ao salvar usuário." : null}
              onCancel={() => navigate("/users")}
              onRemovePhoto={handleRemovePhoto}
              onDeleteAttachment={handleDeleteAttachment}
              onNavigateToAttachment={handleNavigateToAttachment}
            />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default UserEdit;
