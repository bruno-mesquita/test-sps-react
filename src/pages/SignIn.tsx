import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SignInForm from "@/components/SignInForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

function SignIn() {
  const [error, setError] = useState<string | null>(null);

  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/users" replace />;

  const onSubmit = async (data: { email: string; password: string }) => {
    setError(null);
    try {
      await signIn(data.email, data.password);
      navigate("/users", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">SPS React</h1>
          <p className="text-muted-foreground text-sm mt-1">Acesse sua conta</p>
        </div>
        <Alert className="text-sm">
          <Info className="h-4 w-4" />
          <AlertDescription>
            O backend está hospedado em um servidor gratuito e pode ficar inativo por falta de uso.
            O primeiro login pode levar até <strong>50 segundos</strong> enquanto o servidor inicializa.
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Entrar</CardTitle>
            <CardDescription>Insira suas credenciais abaixo</CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm onSubmit={onSubmit} error={error} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SignIn;
