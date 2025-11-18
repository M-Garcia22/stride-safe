
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";

interface BlackBoxReport {
  id: string;
  date: string;
  time: string;
  horseName: string;
  raceNumber: number;
  incident: string;
  status: string;
}

interface BlackBoxReportsCardProps {
  recentBlackBoxReports: BlackBoxReport[];
  onViewReport: (reportId: string) => void;
  onSelectHorse?: (horseName: string) => void;
}

const BlackBoxReportsCard = ({
  recentBlackBoxReports,
  onViewReport,
  onSelectHorse
}: BlackBoxReportsCardProps) => {
  const handleRowClick = (horseName: string) => {
    if (onSelectHorse) {
      onSelectHorse(horseName);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-forest-600" />
          <CardTitle className="text-lg">Recent BlackBox Reports</CardTitle>
        </div>
        <Badge variant="outline" className="bg-forest-50 text-forest-700 border-forest-200">
          Last 24 Hours
        </Badge>
      </CardHeader>
      <CardContent>
        {recentBlackBoxReports.length > 0 ? (
          <div className="space-y-4">
            {recentBlackBoxReports.map((report) => (
              <div 
                key={report.id} 
                className={`flex items-center justify-between p-4 bg-white rounded-lg border hover:bg-blue-50/60 hover:border-blue-200/60 transition-all duration-200 shadow-sm ${onSelectHorse ? 'cursor-pointer' : ''}`}
                onClick={() => handleRowClick(report.horseName)}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-semibold text-gray-900">{report.id}</span>
                    <Badge 
                      variant={report.status === "Completed" ? "default" : "secondary"}
                      className={report.status === "Completed" ? "bg-sage-100 text-sage-800" : "bg-amber-100 text-amber-800"}
                    >
                      {report.status}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    <span className="font-semibold">{report.horseName}</span> • Race {report.raceNumber}
                  </div>
                  <div className="text-sm text-gray-500">
                    {report.incident} • {report.time}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewReport(report.id);
                  }}
                  className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800 transition-all duration-200 ml-4"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Report
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto mb-4 text-sage-400" />
            <p className="text-sage-500 text-base">No BlackBox reports in the last 24 hours</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlackBoxReportsCard;
