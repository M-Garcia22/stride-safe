
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getWelfareRiskCategoryColor } from "../utils/welfareRiskUtils";

interface WelfareRiskInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WelfareRiskInfoDialog = ({ open, onOpenChange }: WelfareRiskInfoDialogProps) => {
  const riskCategories = [
    {
      category: 1,
      label: "Risk Category 1",
      scoreRange: "1-80",
      description: "Lowest Risk - Welfare Scores 1-80 with medio-lateral stride movements less than +/-5G",
      riskLevel: "Lowest Risk"
    },
    {
      category: 2,
      label: "Risk Category 2", 
      scoreRange: "1-80",
      description: "Low Risk - Welfare Scores 1-80 with medio-lateral stride movements in excess of +/-5G",
      riskLevel: "Low Risk"
    },
    {
      category: 3,
      label: "Risk Category 3",
      scoreRange: "81-100", 
      description: "Medium Risk - Welfare Scores 81-100",
      riskLevel: "Medium Risk"
    },
    {
      category: 4,
      label: "Risk Category 4",
      scoreRange: "101-120",
      description: "High Risk - Welfare Scores 101-120", 
      riskLevel: "High Risk"
    },
    {
      category: 5,
      label: "Risk Category 5",
      scoreRange: "121-140",
      description: "Critical Risk - Welfare Scores 121-140",
      riskLevel: "Critical Risk"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Welfare Risk Categories</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Risk categories are assigned based on welfare scores and stride movement analysis to identify horses at elevated risk of career-ending or fatal injuries.
          </p>
          
          <div className="space-y-3">
            {riskCategories.map((risk) => (
              <div key={risk.category} className="flex items-start gap-3 p-3 border rounded-lg">
                <Badge 
                  className="text-white font-bold min-w-[2rem] justify-center"
                  style={{ backgroundColor: getWelfareRiskCategoryColor(risk.category) }}
                >
                  {risk.category}
                </Badge>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{risk.label}</h4>
                  <p className="text-sm text-muted-foreground mb-1">
                    Welfare Score Range: {risk.scoreRange}
                  </p>
                  <p className="text-sm">{risk.description}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {risk.riskLevel}
                </Badge>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Both Risk Categories 1 and 2 correspond to welfare scores between 1-80. 
              The distinction is that Category 2 horses have exhibited medio-lateral stride movements exceeding +/-5G in their race reports, 
              while Category 1 horses show medio-lateral movements under +/-5G.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelfareRiskInfoDialog;
