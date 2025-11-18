
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-green-50/30">
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-emerald-600/5 to-blue-600/10" />
      
      {/* Sophisticated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-8 text-center">
        <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-md border border-white/40 rounded-full px-6 py-3 mb-12 shadow-lg shadow-gray-900/5">
          <Activity className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold tracking-wide">Version 4.2 — Enhanced AI Analytics</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-gray-900 via-green-600 to-emerald-600 bg-clip-text text-transparent mb-8 tracking-tight leading-none">
          Protecting Every
          <br />
          <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            Thoroughbred
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-12 max-w-5xl mx-auto font-light leading-relaxed tracking-wide">
          Revolutionary AI-powered analytics and precision sensors that identify horses at risk, 
          <span className="font-medium text-gray-700"> ensuring peak performance while prioritizing welfare</span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-10 py-4 text-lg font-semibold shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105">
            Explore Technology
          </Button>
          <Button size="lg" variant="outline" className="px-10 py-4 text-lg font-semibold border-gray-300/60 hover:bg-gray-50/80 backdrop-blur-sm transition-all duration-300 hover:scale-105">
            Success Stories
          </Button>
        </div>
      </div>
      
      {/* Modern floating elements */}
      <div className="absolute top-1/4 left-16 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-1/3 right-20 w-48 h-48 bg-gradient-to-br from-blue-400/15 to-green-500/15 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-1/2 right-32 w-24 h-24 bg-gradient-to-br from-emerald-400/25 to-green-500/25 rounded-full blur-lg animate-pulse" />
    </section>
  );
};

export default HeroSection;
