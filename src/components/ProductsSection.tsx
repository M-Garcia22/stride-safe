
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, BookOpen, Building } from "lucide-react";

const ProductsSection = () => {
  const products = [
    {
      name: "Track Analytics Suite",
      description: "Complete racing venue solution with comprehensive monitoring, analytics, and veterinary integration for large racing organizations.",
      icon: Building,
      features: ["Multi-Horse Monitoring", "Veterinary Dashboard", "Regulatory Compliance", "24/7 Expert Support"],
      pricing: "Custom Pricing",
      popular: false
    },
    {
      name: "Trainer Pro Platform",
      description: "Advanced monitoring and analytics platform designed for trainers managing multiple horses with detailed welfare insights.",
      icon: CreditCard,
      features: ["Real-time Health Alerts", "Performance Analytics", "Veterinary Collaboration", "Mobile Access"],
      pricing: "$299/month",
      popular: true
    },
    {
      name: "Stable Starter Package",
      description: "Essential horse monitoring solution for smaller stables and individual horse owners focused on welfare and injury prevention.",
      icon: BookOpen,
      features: ["Basic Health Monitoring", "Injury Risk Alerts", "Weekly Reports", "Email Support"],
      pricing: "$99/month",
      popular: false
    }
  ];

  const subscriptionFeatures = [
    "Advanced AI Analytics",
    "Cloud Data Storage",
    "Mobile & Web Access",
    "Regular System Updates",
    "Veterinary Integration",
    "Expert Consultation Access"
  ];

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-4 shadow-sm">
            <CreditCard className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">Products & Monitoring Plans</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Horse Welfare Solution
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From individual horses to entire racing venues, we have the right monitoring solution to protect thoroughbred welfare and optimize performance.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {products.map((product, index) => {
            const IconComponent = product.icon;
            return (
              <Card key={index} className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                product.popular ? 'ring-2 ring-green-500 shadow-xl scale-105' : 'hover:shadow-xl'
              }`}>
                {product.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <CardHeader className={product.popular ? 'pt-12' : 'pt-6'}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      product.popular ? 'bg-green-500' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${product.popular ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <div className={`text-2xl font-bold ${product.popular ? 'text-green-600' : 'text-gray-900'}`}>
                        {product.pricing}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {product.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      product.popular 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    {product.pricing === "Custom Pricing" ? "Contact Sales" : "Start Monitoring"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Subscription Benefits */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl text-gray-900">All Plans Include</CardTitle>
            <CardDescription className="text-gray-600">
              Every monitoring solution comes with these essential features for comprehensive horse welfare protection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptionFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ProductsSection;
