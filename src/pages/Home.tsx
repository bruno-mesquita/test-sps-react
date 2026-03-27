import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            SPS React
          </h1>
          <p className="text-muted-foreground text-lg">
            Gerenciamento de usuários
          </p>
        </div>
        <Button size="lg" render={<Link to="/users" />}>
          <Users className="mr-2 h-5 w-5" />
          Ver Usuários
        </Button>
      </div>
    </div>
  );
}

export default Home;
