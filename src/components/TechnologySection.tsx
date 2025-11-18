
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Brain, Zap, Stethoscope } from "lucide-react";

const TechnologySection = () => {
  const technologies = [
    {
      title: "AI Biomechanical Analysis",
      description: "Advanced machine learning algorithms analyze gait patterns, stride mechanics, and movement asymmetries to detect early signs of injury or discomfort with unprecedented precision.",
      features: ["Gait Pattern Recognition", "Stride Analysis", "Movement Asymmetry Detection", "Predictive Injury Modeling"],
      icon: Brain,
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      title: "Advanced Sensor Technology", 
      description: "Ultra-lightweight, non-invasive sensors capture real-time data on horse movement, vital signs, and biomechanical stress indicators with clinical-grade accuracy.",
      features: ["Real-time Monitoring", "Wireless Data Transmission", "Waterproof Design", "24/7 Continuous Tracking"],
      icon: Zap,
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "Expert Veterinary Insights",
      description: "Our platform combines AI predictions with expert veterinary knowledge to provide actionable recommendations for horse care and training optimization.",
      features: ["Veterinary Dashboard", "Customized Care Plans", "Expert Consultation Portal", "Treatment Tracking"],
      icon: Stethoscope,
      gradient: "from-emerald-500 to-green-600"
    }
  ];

  return (
    <section id="technology" className="py-32 bg-gradient-to-br from-gray-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-md rounded-full px-6 py-3 mb-8 shadow-lg shadow-gray-900/5 border border-gray-200/50">
            <Rocket className="w-5 h-5 text-green-600" />
            <span className="text-sm font-bold text-green-600 tracking-wide uppercase">Our Technology</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight leading-none">
            Revolutionary Horse
            <br />
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Monitoring Technology
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
            We leverage cutting-edge AI, precision sensors, and veterinary expertise to create comprehensive solutions that 
            <span className="font-medium text-gray-700"> protect thoroughbred welfare while optimizing performance</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {technologies.map((tech, index) => {
            const IconComponent = tech.icon;
            return (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 bg-gradient-to-br from-white via-white to-gray-50/50 backdrop-blur-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Technology icon header */}
                <div className="h-48 overflow-hidden relative bg-gradient-to-br from-gray-100 via-gray-50 to-white">
                  <div className={`absolute inset-0 bg-gradient-to-br ${tech.gradient} opacity-10`} />
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-20 h-20 bg-gradient-to-br ${tech.gradient} rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-500`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-6 relative z-10">
                  <CardTitle className="text-2xl font-bold group-hover:text-green-600 transition-colors duration-300 tracking-tight">
                    {tech.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed font-light">
                    {tech.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-3">
                    {tech.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 bg-gradient-to-r ${tech.gradient} rounded-full shadow-sm`} />
                        <span className="text-sm text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Technology showcase visual */}
        <div className="mt-24 relative">
          <div className="h-80 bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 rounded-3xl overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-emerald-600/10 to-blue-600/20" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:20px_20px]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-4xl font-black mb-6 tracking-tight">Built for Horse Welfare</h3>
                <p className="text-xl opacity-90 font-light max-w-2xl mx-auto leading-relaxed">
                  Our technology evolves with the needs of every thoroughbred and racing organization, 
                  setting new standards for precision and care
                </p>
              </div>
            </div>
            
            {/* Modern animated elements */}
            <div className="absolute top-12 left-12 w-6 h-6 bg-white/20 rounded-full animate-pulse shadow-lg" />
            <div className="absolute bottom-16 right-20 w-8 h-8 bg-green-400/30 rounded-full animate-pulse shadow-lg" />
            <div className="absolute top-20 right-12 w-4 h-4 bg-blue-400/40 rounded-full animate-pulse shadow-lg" />
            <div className="absolute bottom-12 left-20 w-5 h-5 bg-emerald-400/35 rounded-full animate-pulse shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
