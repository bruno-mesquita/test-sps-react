import React, { useRef, useState } from "react";
import { UserAttachment } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Camera, Paperclip, X, FileText } from "lucide-react";

const MAX_ATTACHMENTS = 5;

export interface UserFormValues {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  photo: File | null;
  newAttachments: File[];
}

interface UserFormProps {
  defaultValues?: {
    name?: string;
    email?: string;
    isAdmin?: boolean;
    photoPreview?: string | null;
    existingAttachments?: UserAttachment[];
  };
  onSubmit: (data: UserFormValues) => Promise<void>;
  userId?: number;
  loading?: boolean;
  error?: string | null;
  onCancel?: () => void;
  onRemovePhoto?: () => Promise<void>;
  onDeleteAttachment?: (id: number) => Promise<void>;
  onNavigateToAttachment?: (att: UserAttachment) => void;
}

function UserForm({
  defaultValues,
  onSubmit,
  userId,
  loading = false,
  error,
  onCancel,
  onRemovePhoto,
  onDeleteAttachment,
  onNavigateToAttachment,
}: UserFormProps) {
  const isNew = userId === undefined;

  const [name, setName] = useState(defaultValues?.name ?? "");
  const [email, setEmail] = useState(defaultValues?.email ?? "");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(defaultValues?.isAdmin ?? false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    defaultValues?.photoPreview ?? null
  );
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<UserAttachment[]>(
    defaultValues?.existingAttachments ?? []
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onRemovePhoto?.();
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setNewAttachments((prev) => {
      const slots = MAX_ATTACHMENTS - existingAttachments.length - prev.length;
      return [...prev, ...files.slice(0, slots)];
    });
    e.target.value = "";
  };

  const removeNewAttachment = (index: number) => {
    setNewAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExisting = async (att: UserAttachment) => {
    await onDeleteAttachment?.(att.id as number);
    setExistingAttachments((prev) => prev.filter((a) => a.id !== att.id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, email, password, isAdmin, photo, newAttachments });
  };

  const totalAttachments = existingAttachments.length + newAttachments.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
            <AvatarFallback>{name ? name.charAt(0).toUpperCase() : "?"}</AvatarFallback>
          </Avatar>
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-5 w-5 text-white" />
          </span>
          {!isNew && photoPreview && (
            <span
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
              onClick={handleRemovePhoto}
            >
              <X className="h-3 w-3" />
            </span>
          )}
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
            <span className="text-muted-foreground text-xs ml-1">(deixe em branco para manter)</span>
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

      {!isNew && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Anexos</Label>
            <span className="text-xs text-muted-foreground">
              {totalAttachments}/{MAX_ATTACHMENTS}
            </span>
          </div>
          <input
            ref={attachmentInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleAttachmentChange}
          />
          {existingAttachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
            >
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <button
                type="button"
                onClick={() => onNavigateToAttachment?.(att)}
                className="flex-1 truncate text-left text-primary underline-offset-4 hover:underline"
              >
                {att.filename}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteExisting(att)}
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
                onClick={() => removeNewAttachment(index)}
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
            disabled={totalAttachments >= MAX_ATTACHMENTS}
            onClick={() => attachmentInputRef.current?.click()}
            className="w-full"
          >
            <Paperclip className="mr-2 h-4 w-4" />
            Adicionar Anexo
          </Button>
        </div>
      )}

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
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}

export default UserForm;
