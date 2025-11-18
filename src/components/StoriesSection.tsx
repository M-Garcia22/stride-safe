
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, Award, Shield } from "lucide-react";

const StoriesSection = () => {
  const stories = [
    {
      title: "95% Injury Reduction at Churchill Downs",
      description: "How our AI-powered sensor technology helped Churchill Downs prevent 47 potential career-ending injuries in their 2023 season, revolutionizing track safety standards.",
      category: "Case Study",
      readTime: "5 min read",
      icon: TrendingUp,
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "Early Detection Saves Champions", 
      description: "Discovering subtle lameness patterns 3 weeks before traditional methods, allowing for preventive care and full recovery while maintaining peak performance capabilities.",
      category: "Technology",
      readTime: "7 min read",
      icon: Shield,
      gradient: "from-emerald-500 to-green-600"
    },
    {
      title: "Welfare-First Racing Revolution",
      description: "Leading tracks embrace technology that puts horse welfare at the center of performance optimization, creating a new paradigm for racing excellence and ethical competition.",
      category: "Industry Impact",
      readTime: "4 min read",
      icon: Award,
      gradient: "from-purple-500 to-indigo-600"
    }
  ];

  return (
    <section id="stories" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-green-50/80 backdrop-blur-md rounded-full px-6 py-3 mb-8 shadow-lg shadow-gray-900/5 border border-green-200/50">
            <BookOpen className="w-5 h-5 text-green-600" />
            <span className="text-sm font-bold text-green-600 tracking-wide uppercase">Success Stories</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight leading-none">
            Protecting Thoroughbreds
            <br />
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
            See how racing organizations around the world are using our technology to prevent injuries, improve welfare, and 
            <span className="font-medium text-gray-700"> ensure horses reach their full potential safely</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {stories.map((story, index) => {
            const IconComponent = story.icon;
            return (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-white via-white to-gray-50/50 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="h-64 bg-gradient-to-br from-gray-100 via-gray-50 to-white relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${story.gradient} opacity-10`} />
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px]" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-20 h-20 bg-gradient-to-br ${story.gradient} rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-500`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-6 left-6">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700 font-semibold px-3 py-1 shadow-sm backdrop-blur-sm">
                      {story.category}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="text-xl font-bold group-hover:text-green-600 transition-colors duration-300 tracking-tight leading-tight">
                    {story.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed font-light text-base">
                    {story.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="font-medium">{story.readTime}</span>
                    <span className="story-link font-semibold text-green-600 hover:text-green-700 transition-colors duration-200">Read More →</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StoriesSection;
