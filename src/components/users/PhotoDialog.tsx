import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PhotoDialogProps {
  src: string | null;
  alt: string;
  onClose: () => void;
}

function PhotoDialog({ src, alt, onClose }: PhotoDialogProps) {
  return (
    <Dialog open={src !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        {src && (
          <img
            src={src}
            alt={alt}
            className="w-full rounded-lg object-contain max-h-[70vh]"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PhotoDialog;
