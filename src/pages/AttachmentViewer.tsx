import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface AttachmentState {
  filename: string;
  url: string;
}

function getFileType(filename: string): "image" | "pdf" | "other" {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  return "other";
}

function AttachmentViewer() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const state = location.state as AttachmentState | null;

  const goBack = () => navigate(`/users/${userId}`);

  if (!state?.url) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Anexo não encontrado.</p>
        <Button variant="outline" onClick={goBack}>
          Voltar
        </Button>
      </div>
    );
  }

  const { filename, url } = state;
  const fileType = getFileType(filename);

  const downloadAction = (
    <a href={url} download={filename}>
      <Button variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Baixar
      </Button>
    </a>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title={filename} onBack={goBack} actions={downloadAction} />
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center">
        {fileType === "image" && (
          <img
            src={url}
            alt={filename}
            className="max-w-full max-h-[80vh] object-contain rounded-md border"
          />
        )}
        {fileType === "pdf" && (
          <iframe
            src={url}
            title={filename}
            className="w-full flex-1 rounded-md border"
            style={{ minHeight: "75vh" }}
          />
        )}
        {fileType === "other" && (
          <div className="flex flex-col items-center gap-6 mt-16 text-center">
            <FileText className="h-20 w-20 text-muted-foreground" />
            <p className="text-muted-foreground">
              Visualização não disponível para este tipo de arquivo.
            </p>
            <a href={url} download={filename}>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Baixar {filename}
              </Button>
            </a>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default AttachmentViewer;
