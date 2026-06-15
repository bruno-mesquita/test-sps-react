import { User } from "@/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PhotoDialogProps {
  user: User | null;
  onClose: () => void;
}

function PhotoDialog({ user, onClose }: PhotoDialogProps) {
  return (
    <Dialog open={user !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        {user && (
          <img
            src={user.originalUrl}
            alt={user.name}
            className="w-full rounded-lg object-contain max-h-[70vh]"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PhotoDialog;
