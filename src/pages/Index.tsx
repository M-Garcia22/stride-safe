
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StoriesSection from "@/components/StoriesSection";
import CompanySection from "@/components/CompanySection";
import TechnologySection from "@/components/TechnologySection";
import ProductsSection from "@/components/ProductsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <StoriesSection />
      <CompanySection />
      <TechnologySection />
      <ProductsSection />
      
      {/* Modern Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:20px_20px]" />
        <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
          <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Ready to Transform
            <br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Horse Racing?
            </span>
          </h3>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
            Join leading racing organizations worldwide in protecting thoroughbred welfare with 
            <span className="font-medium text-white"> cutting-edge technology and precision monitoring</span>
          </p>
          <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-12 py-4 text-lg font-bold shadow-2xl shadow-green-500/25 hover:shadow-3xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105">
            Start Protecting Horses Today
          </Button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
      </footer>
    </div>
  );
};

export default Index;
