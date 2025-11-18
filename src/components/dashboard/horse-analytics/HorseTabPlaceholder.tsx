
import { Horse } from "@/types/horse";

interface HorseTabPlaceholderProps {
  horse: Horse;
  title: string;
  description: string;
}

const HorseTabPlaceholder = ({ horse, title, description }: HorseTabPlaceholderProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground">
        {description.replace('{horseName}', horse.name)}
      </p>
      <div className="text-center py-8 text-muted-foreground">
        {title} module content will be implemented here
      </div>
    </div>
  );
};

export default HorseTabPlaceholder;
