
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from "lucide-react";
import { PostRaceWelfareReport } from "../../../data/postRaceData";

interface StrideSafeAnalysisTableProps {
  reports: PostRaceWelfareReport[];
  compact?: boolean;
}

const getWelfareIndicator = (status: 'good' | 'warning' | 'alert') => {
  const colors = {
    good: 'bg-green-500',
    warning: 'bg-amber-500', 
    alert: 'bg-red-500'
  };
  
  return (
    <div 
      className={`w-3 h-3 rounded-full ${colors[status]}`}
      title={`Welfare: ${status}`}
    />
  );
};

const getRiskBadge = (risk: 1 | 2 | 3 | 4 | 5, compact?: boolean) => {
  let badgeClass = '';
  
  switch (risk) {
    case 1:
      badgeClass = 'bg-green-100 text-green-800 border-green-200';
      break;
    case 2:
      badgeClass = 'bg-amber-100 text-amber-800 border-amber-200';
      break;
    case 3:
    case 4:
    case 5:
      badgeClass = 'bg-red-100 text-red-800 border-red-200';
      break;
  }
  
  return (
    <Badge className={`${badgeClass} font-medium ${compact ? 'text-xs px-1.5 py-0' : ''}`}>
      {risk}
    </Badge>
  );
};

const getXBadge = (isPositive: boolean, compact?: boolean) => {
  return isPositive ? (
    <Badge variant="destructive" className={`${compact ? 'px-1 py-0' : 'px-1.5 py-0.5'}`}>
      <X className={`${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} />
    </Badge>
  ) : null;
};

const StrideSafeAnalysisTable = ({ reports, compact = false }: StrideSafeAnalysisTableProps) => {
  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground text-sm">
        No analysis data available
      </div>
    );
  }

  const cellClass = compact ? "text-xs py-1.5 px-2" : "text-xs py-2";
  const headerClass = compact ? "text-xs py-2 px-2" : "text-xs";

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={headerClass}>Date</TableHead>
            <TableHead className={headerClass}>Welfare</TableHead>
            <TableHead className={headerClass}>Risk</TableHead>
            <TableHead className={headerClass}>C-Fx</TableHead>
            <TableHead className={headerClass}>S-Fx</TableHead>
            <TableHead className={headerClass}>LF</TableHead>
            <TableHead className={headerClass}>RF</TableHead>
            <TableHead className={headerClass}>BF</TableHead>
            <TableHead className={headerClass}>HL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className={cellClass}>
                {new Date(report.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </TableCell>
              <TableCell className={cellClass}>
                {getWelfareIndicator(report.welfareStatus)}
              </TableCell>
              <TableCell className={cellClass}>
                {getRiskBadge(report.riskCategory, compact)}
              </TableCell>
              <TableCell className={`${cellClass} text-center`}>
                {getXBadge(report.condylarFx, compact)}
              </TableCell>
              <TableCell className={`${cellClass} text-center`}>
                {getXBadge(report.sesamoidFx, compact)}
              </TableCell>
              <TableCell className={`${cellClass} text-center`}>
                {getXBadge(report.leftFront, compact)}
              </TableCell>
              <TableCell className={`${cellClass} text-center`}>
                {getXBadge(report.rightFront, compact)}
              </TableCell>
              <TableCell className={`${cellClass} text-center`}>
                {getXBadge(report.bothFront, compact)}
              </TableCell>
              <TableCell className={`${cellClass} text-center`}>
                {getXBadge(report.hindLimb, compact)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StrideSafeAnalysisTable;
