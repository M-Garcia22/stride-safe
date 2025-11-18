
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown } from "lucide-react";

interface SubscriptionPlan {
  name: string;
  maxHorses: number;
  price: number;
  features: string[];
  current?: boolean;
}

interface SubscriptionUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: string;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    name: "Wellness Basic",
    maxHorses: 10,
    price: 200,
    features: ["Basic wellness monitoring", "Up to 10 horses", "Email alerts"],
    current: true
  },
  {
    name: "Wellness Basic",
    maxHorses: 25,
    price: 450,
    features: ["Basic wellness monitoring", "Up to 25 horses", "Email alerts"]
  },
  {
    name: "Wellness Pro",
    maxHorses: 10,
    price: 300,
    features: ["Advanced analytics", "Performance insights", "Priority support", "Up to 10 horses"]
  },
  {
    name: "Wellness Pro",
    maxHorses: 25,
    price: 650,
    features: ["Advanced analytics", "Performance insights", "Priority support", "Up to 25 horses"]
  },
  {
    name: "Wellness Pro",
    maxHorses: 50,
    price: 1200,
    features: ["Advanced analytics", "Performance insights", "Priority support", "Up to 50 horses"]
  },
  {
    name: "Wellness Pro",
    maxHorses: 100,
    price: 2000,
    features: ["Advanced analytics", "Performance insights", "Priority support", "Up to 100 horses"]
  },
  {
    name: "Wellness Pro",
    maxHorses: 200,
    price: 3000,
    features: ["Advanced analytics", "Performance insights", "Priority support", "Up to 200 horses"]
  }
];

const SubscriptionUpgradeDialog = ({ open, onOpenChange, currentPlan }: SubscriptionUpgradeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upgrade Your Subscription</DialogTitle>
          <DialogDescription>
            Choose a plan that fits your stable size and needs.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptionPlans.map((plan, index) => (
            <div key={index} className={`border rounded-lg p-4 ${plan.current ? 'border-primary bg-primary/5' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{plan.name}</h3>
                {plan.current && <Badge variant="secondary">Current</Badge>}
                {plan.name === "Wellness Pro" && <Crown className="w-4 h-4 text-yellow-500" />}
              </div>
              
              <div className="mb-4">
                <span className="text-2xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              
              <div className="mb-4">
                <p className="font-medium text-primary">Up to {plan.maxHorses} horses</p>
              </div>
              
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm">
                    <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full" 
                variant={plan.current ? "secondary" : "default"}
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Need more than 200 horses? Contact our sales team for enterprise pricing.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionUpgradeDialog;
