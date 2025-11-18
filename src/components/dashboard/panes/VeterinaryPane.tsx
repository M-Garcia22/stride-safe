
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VeterinaryPane = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Veterinary Care</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This pane will contain veterinary records, health monitoring, and medical protocols.
            You can define what specific veterinary information and tools should be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VeterinaryPane;
