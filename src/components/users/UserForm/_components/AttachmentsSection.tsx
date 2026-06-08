import { useRef } from "react";
import { UserAttachment } from "@/types";
import { Button } from "@/components/ui/button";
import { Paperclip, X, FileText } from "lucide-react";

const MAX_ATTACHMENTS = 5;

interface AttachmentsSectionProps {
  existingAttachments: UserAttachment[];
  newAttachments: File[];
  onAddFiles: (files: File[]) => void;
  onRemoveNew: (index: number) => void;
  onDeleteExisting: (att: UserAttachment) => void;
  onNavigate?: (att: UserAttachment) => void;
}

function AttachmentsSection({
  existingAttachments,
  newAttachments,
  onAddFiles,
  onRemoveNew,
  onDeleteExisting,
  onNavigate,
}: AttachmentsSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const total = existingAttachments.length + newAttachments.length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const slots = MAX_ATTACHMENTS - total;
    onAddFiles(files.slice(0, slots));
    e.target.value = "";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium leading-none">Anexos</span>
        <span className="text-xs text-muted-foreground">
          {total}/{MAX_ATTACHMENTS}
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleChange}
      />
      {existingAttachments.map((att) => (
        <div
          key={att.id}
          className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
        >
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          <button
            type="button"
            onClick={() => onNavigate?.(att)}
            className="flex-1 truncate text-left text-primary underline-offset-4 hover:underline"
          >
            {att.filename}
          </button>
          <button
            type="button"
            onClick={() => onDeleteExisting(att)}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      {newAttachments.map((file, index) => (
        <div
          key={index}
          className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
        >
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate">{file.name}</span>
          <button
            type="button"
            onClick={() => onRemoveNew(index)}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={total >= MAX_ATTACHMENTS}
        onClick={() => inputRef.current?.click()}
        className="w-full"
      >
        <Paperclip className="mr-2 h-4 w-4" />
        Adicionar Anexo
      </Button>
    </div>
  );
}

export default AttachmentsSection;
