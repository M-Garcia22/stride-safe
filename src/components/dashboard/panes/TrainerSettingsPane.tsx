
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TrainerSettingsPane = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trainer Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This pane will contain trainer-specific settings, notification preferences,
            and account management options.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerSettingsPane;
