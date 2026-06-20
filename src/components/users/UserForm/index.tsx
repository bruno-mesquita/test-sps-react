import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserAttachment } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import AvatarUpload from "./_components/AvatarUpload";
import AttachmentsSection from "./_components/AttachmentsSection";

const buildSchema = (isNew: boolean) =>
  z.object({
    name: z.string().min(1, "Nome obrigatório"),
    email: z.string().email("Email inválido"),
    password: isNew
      ? z.string().min(1, "Senha obrigatória")
      : z.string().optional(),
    isAdmin: z.boolean(),
  });

type FormFields = {
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
};

export interface UserFormValues {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  photo: File | null;
  newAttachments: File[];
}

interface UserFormProps {
  isNew?: boolean;
  defaultValues?: {
    name?: string;
    email?: string;
    isAdmin?: boolean;
    photoPreview?: string | null;
    existingAttachments?: UserAttachment[];
  };
  onSubmit: (data: UserFormValues) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  onCancel?: () => void;
  onRemovePhoto?: () => Promise<unknown>;
  onDeleteAttachment?: (id: string) => Promise<unknown>;
  onNavigateToAttachment?: (att: UserAttachment) => void;
}

function UserForm({
  isNew = false,
  defaultValues,
  onSubmit,
  loading = false,
  error,
  onCancel,
  onRemovePhoto,
  onDeleteAttachment,
  onNavigateToAttachment,
}: UserFormProps) {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(buildSchema(isNew)),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      password: "",
      isAdmin: defaultValues?.isAdmin ?? false,
    },
  });

  const nameValue = watch("name");

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    defaultValues?.photoPreview ?? null
  );
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<UserAttachment[]>(
    defaultValues?.existingAttachments ?? []
  );

  const handlePhotoChange = (file: File, preview: string) => {
    setPhoto(file);
    setPhotoPreview(preview);
  };

  const handleRemovePhoto = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onRemovePhoto?.();
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleDeleteExisting = async (att: UserAttachment) => {
    await onDeleteAttachment?.(att.id);
    setExistingAttachments((prev) => prev.filter((a) => a.id !== att.id));
  };

  const handleFormSubmit = async (fields: FormFields) => {
    await onSubmit({
      name: fields.name,
      email: fields.email,
      password: fields.password ?? "",
      isAdmin: fields.isAdmin,
      photo,
      newAttachments,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <AvatarUpload
        name={nameValue}
        preview={photoPreview}
        isNew={isNew}
        onChange={handlePhotoChange}
        onRemove={handleRemovePhoto}
      />

      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              id="name"
              type="text"
              placeholder="Nome completo"
              {...field}
            />
          )}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              {...field}
            />
          )}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Senha
          {!isNew && (
            <span className="text-muted-foreground text-xs ml-1">(deixe em branco para manter)</span>
          )}
        </Label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...field}
            />
          )}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <AttachmentsSection
        existingAttachments={existingAttachments}
        newAttachments={newAttachments}
        onAddFiles={(files) => setNewAttachments((prev) => [...prev, ...files])}
        onRemoveNew={(index) =>
          setNewAttachments((prev) => prev.filter((_, i) => i !== index))
        }
        onDeleteExisting={handleDeleteExisting}
        onNavigate={onNavigateToAttachment}
      />

      <div className="flex items-center gap-2">
        <Controller
          name="isAdmin"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="isAdmin"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
          )}
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
