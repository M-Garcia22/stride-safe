
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ReportsPane = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reports & Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This pane will contain reports, analytics, and data visualization tools.
            You can define what specific reports and metrics should be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPane;
