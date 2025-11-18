
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EditHorseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  horseId: number;
  horseName: string;
  action: 'remove' | 'paddock' | 'activate';
  onConfirm: (horseId: number, action: 'remove' | 'paddock' | 'activate') => void;
}

const EditHorseDialog = ({ open, onOpenChange, horseId, horseName, action, onConfirm }: EditHorseDialogProps) => {
  const getDialogContent = () => {
    switch (action) {
      case 'remove':
        return {
          title: "Remove Horse from Stable",
          description: `Are you sure you want to remove "${horseName}" from your stable? This action cannot be undone.`,
          actionText: "Remove",
          actionClass: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
        };
      case 'paddock':
        return {
          title: "Move Horse to Paddock",
          description: `Move "${horseName}" to paddock mode? The horse will remain in your stable with basic information only. Wellness and performance data will be hidden and the horse won't count toward your subscription limit.`,
          actionText: "Move to Paddock",
          actionClass: ""
        };
      case 'activate':
        return {
          title: "Activate Horse",
          description: `Activate "${horseName}" from paddock mode? The horse will return to full training mode with wellness and performance data available and will count toward your subscription limit.`,
          actionText: "Activate",
          actionClass: ""
        };
      default:
        return {
          title: "",
          description: "",
          actionText: "",
          actionClass: ""
        };
    }
  };

  const content = getDialogContent();

  const handleConfirm = () => {
    onConfirm(horseId, action);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{content.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {content.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className={content.actionClass}
          >
            {content.actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditHorseDialog;
