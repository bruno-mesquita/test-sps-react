import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UserForm, { UserFormValues } from "@/components/users/UserForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function newUserLoader() {
  return null;
}

function UserCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async ({ name, email, password, isAdmin, photo }: UserFormValues) => {
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("type", isAdmin ? "admin" : "user");
      formData.append("password", password);
      if (photo) formData.append("photo", photo);
      await api.post("/users", formData);
      navigate("/users");
    } catch {
      setError("Erro ao criar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Novo Usuário" onBack={() => navigate("/users")} />
      <main className="container mx-auto px-4 py-8 max-w-md flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Criar usuário</CardTitle>
            <CardDescription>Preencha os dados do novo usuário.</CardDescription>
          </CardHeader>
          <CardContent>
            <UserForm
              isNew
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              onCancel={() => navigate("/users")}
            />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default UserCreate;
