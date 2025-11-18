
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsPane = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This pane will contain system settings, user preferences, and configuration options.
            You can define what specific settings and controls should be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPane;
