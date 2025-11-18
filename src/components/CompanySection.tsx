
import { Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CompanySection = () => {
  const stats = [
    { number: "40+", label: "Years of Research", description: "Proven expertise" },
    { number: "70,000+", label: "Horses in Database", description: "Comprehensive monitoring" },
    { number: "1100", label: "Data Points per Second", description: "Real-time analysis" },
    { number: "11", label: "U.S. Racetracks", description: "Have used/are using StrideSAFE" }
  ];

  return (
    <section id="company" className="py-32 bg-gradient-to-br from-slate-50 via-gray-50 to-green-50/30">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-md rounded-full px-6 py-3 mb-8 shadow-lg shadow-gray-900/5 border border-gray-200/50">
              <Building className="w-5 h-5 text-green-600" />
              <span className="text-sm font-bold text-green-600 tracking-wide uppercase">About Our Mission</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 tracking-tight leading-none">
              Pioneering Thoroughbred
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                Welfare Technology
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 font-light leading-relaxed">
              We combine decades of veterinary expertise with cutting-edge AI and sensor technology to create the most 
              <span className="font-medium text-gray-700"> advanced horse welfare monitoring system</span> in the racing industry.
            </p>
            
            <p className="text-lg md:text-xl text-gray-600 mb-12 font-light leading-relaxed">
              By detecting subtle biomechanical changes weeks before traditional methods, we empower stakeholders to make 
              <span className="font-medium text-gray-700"> informed decisions that protect horses and preserve careers</span>.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-4xl md:text-5xl font-black text-green-600 mb-2 tracking-tight group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-gray-900 font-bold text-sm uppercase tracking-wide mb-1">{stat.label}</div>
                  <div className="text-gray-500 text-xs font-medium">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <Card className="p-12 bg-white/80 backdrop-blur-lg border-0 shadow-2xl rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-blue-50/50" />
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px]" />
              
              <CardContent className="space-y-8 relative z-10">
                <div className="h-80 rounded-2xl overflow-hidden relative shadow-inner bg-gradient-to-br from-green-500/30 via-emerald-500/20 to-green-500/30">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center relative z-10 text-white">
                      <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <Building className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-black tracking-tight mb-4">Our Vision</h3>
                      <p className="leading-relaxed font-light text-lg opacity-90">
                        A racing industry where technology ensures every horse's welfare and peak performance through 
                        <span className="font-medium"> precision monitoring and predictive care</span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Modern decorative elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-gradient-to-br from-blue-400/15 to-green-500/15 rounded-full blur-3xl animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanySection;
