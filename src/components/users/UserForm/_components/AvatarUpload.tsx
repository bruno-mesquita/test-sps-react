import React, { useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, X } from "lucide-react";

interface AvatarUploadProps {
  name: string;
  preview: string | null;
  isNew: boolean;
  onChange: (file: File, preview: string) => void;
  onRemove: (e: React.MouseEvent) => void;
}

function AvatarUpload({ name, preview, isNew, onChange, onRemove }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(file, URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="relative group focus:outline-none"
      >
        <Avatar size="lg" className="size-20 cursor-pointer">
          {preview && <AvatarImage src={preview} alt={name} />}
          <AvatarFallback>{name ? name.charAt(0).toUpperCase() : "?"}</AvatarFallback>
        </Avatar>
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="h-5 w-5 text-white" />
        </span>
        {!isNew && preview && (
          <span
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
            onClick={onRemove}
          >
            <X className="h-3 w-3" />
          </span>
        )}
      </button>
      <span className="text-xs text-muted-foreground">Clique para alterar foto</span>
    </div>
  );
}

export default AvatarUpload;
