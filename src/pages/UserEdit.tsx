import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { User, UserAttachment } from "@/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UserForm, { UserFormValues } from "@/components/users/UserForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LoaderData {
  user: User;
}

export async function userLoader({
  params,
}: {
  params: Record<string, string | undefined>;
}): Promise<LoaderData> {
  const [userRes, attachmentsRes] = await Promise.all([
    api.get(`/users/${params.userId}`),
    api.get(`/users/${params.userId}/attachments`),
  ]);
  return { user: { ...userRes.data, attachments: attachmentsRes.data } };
}

function UserEdit() {
  const { user } = useLoaderData() as LoaderData;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async ({ name, email, password, isAdmin, photo, newAttachments }: UserFormValues) => {
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("type", isAdmin ? "admin" : "user");
      if (password) formData.append("password", password);
      if (photo) formData.append("photo", photo);
      await api.put(`/users/${user.id}`, formData);

      if (newAttachments.length > 0) {
        const attachmentData = new FormData();
        newAttachments.forEach((file) => attachmentData.append("files", file));
        await api.post(`/users/${user.id}/attachments`, attachmentData);
      }

      navigate("/users");
    } catch {
      setError("Erro ao salvar usuário.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    await api.delete(`/users/${user.id}/photo`);
  };

  const handleDeleteAttachment = async (id: number) => {
    await api.delete(`/users/${user.id}/attachments/${id}`);
  };

  const handleNavigateToAttachment = (att: UserAttachment) => {
    navigate(`/users/${user.id}/attachments/${att.id}`, {
      state: { filename: att.filename, url: att.url },
    });
  };

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
                existingAttachments: user.attachments ?? [],
              }}
              onSubmit={handleSubmit}
              isNew={false}
              loading={loading}
              error={error}
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
