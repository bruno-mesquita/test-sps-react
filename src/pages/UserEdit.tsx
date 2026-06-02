import React, { useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Loader2, Camera } from "lucide-react";

interface LoaderData {
  user: User | null;
}

export function newUserLoader(): LoaderData {
  return { user: null };
}

export async function userLoader({
  params,
}: {
  params: Record<string, string | undefined>;
}): Promise<LoaderData> {
  const response = await api.get(`/users/${params.userId}`);

  return { user: response.data };
}

function UserEdit() {
  const { user } = useLoaderData() as LoaderData;
  const isNew = user === null;
  const navigate = useNavigate();

  const [name, setName] = useState(isNew ? "" : user!.name);
  const [email, setEmail] = useState(isNew ? "" : user!.email);
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(!isNew && user!.type === "admin");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    isNew ? null : (user!.previewUrl ?? null)
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const type = isAdmin ? "admin" : "user";
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("type", type);
      if (password) formData.append("password", password);
      if (photo) formData.append("photo", photo);

      if (isNew) {
        await api.post("/users", formData);
      } else {
        await api.put(`/users/${user!.id}`, formData);
      }
      navigate("/users");
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/users")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">
            {isNew ? "Novo Usuário" : "Editar Usuário"}
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>
              {isNew ? "Criar usuário" : "Atualizar usuário"}
            </CardTitle>
            <CardDescription>
              {isNew
                ? "Preencha os dados do novo usuário."
                : "Altere os dados do usuário."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group focus:outline-none"
                >
                  <Avatar size="lg" className="size-20 cursor-pointer">
                    {photoPreview && <AvatarImage src={photoPreview} alt={name} />}
                    <AvatarFallback>
                      {name ? name.charAt(0).toUpperCase() : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-5 w-5 text-white" />
                  </span>
                </button>
                <span className="text-xs text-muted-foreground">Clique para alterar foto</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  Senha
                  {!isNew && (
                    <span className="text-muted-foreground text-xs ml-1">
                      (deixe em branco para manter)
                    </span>
                  )}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={isNew}
                  placeholder="••••••••"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isAdmin"
                  checked={isAdmin}
                  onCheckedChange={(checked) => setIsAdmin(checked === true)}
                />
                <Label htmlFor="isAdmin">Administrador</Label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/users")}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default UserEdit;
