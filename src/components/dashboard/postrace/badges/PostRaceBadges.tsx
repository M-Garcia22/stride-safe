
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { PostRaceHorse } from "../../../../data/postRaceData";

export const getWelfareBadge = (horse: PostRaceHorse) => {
  // Special handling for DNF horses
  if (horse.raceStatus === 'dnf') {
    return <Badge className="bg-gray-100 text-gray-800">DNF</Badge>;
  }

  const variants: { [key: string]: string } = {
    'green': 'bg-green-500',
    'amber': 'bg-yellow-500',
    'red': 'bg-red-500'
  };
  return (
    <div className={`w-4 h-4 rounded-full ${variants[horse.welfareStatus] || 'bg-gray-500'}`} 
         title={`Welfare Status: ${horse.welfareStatus}`} />
  );
};

export const getRiskBadge = (horse: PostRaceHorse) => {
  // Special handling for DNF horses
  if (horse.raceStatus === 'dnf') {
    return <Badge className="bg-gray-100 text-gray-800">NA</Badge>;
  }

  // Convert Cat labels to numbers and apply color scheme
  const riskNumber = horse.riskCategory.replace('Cat ', '');
  let badgeClass = '';
  
  switch (riskNumber) {
    case '1':
      badgeClass = 'bg-green-100 text-green-800';
      break;
    case '2':
      badgeClass = 'bg-yellow-100 text-yellow-800';
      break;
    case '3':
    case '4':
    case '5':
      badgeClass = 'bg-red-100 text-red-800';
      break;
    default:
      badgeClass = 'bg-gray-100 text-gray-800';
  }
  
  return <Badge className={badgeClass}>{riskNumber}</Badge>;
};

export const getWelfareAlertBadge = (horse: PostRaceHorse) => {
  // Special handling for DNF horses
  if (horse.raceStatus === 'dnf') {
    return <Badge className="bg-gray-100 text-gray-800">DNF</Badge>;
  }

  return horse.welfareAlert ? (
    <AlertTriangle className="w-4 h-4 text-red-500" />
  ) : null;
};

export const getStatusBadge = (status: string) => {
  const variants: { [key: string]: { label: string; className: string } } = {
    'finished': { label: 'Finished', className: 'bg-green-100 text-green-800' },
    'dnf': { label: 'DNF', className: 'bg-red-100 text-red-800' },
    'scratched': { label: 'Scratched', className: 'bg-gray-100 text-gray-800' },
    'disqualified': { label: 'DQ', className: 'bg-orange-100 text-orange-800' }
  };
  const variant = variants[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
  return <Badge className={variant.className}>{variant.label}</Badge>;
};
