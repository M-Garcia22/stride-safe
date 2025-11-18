import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [activeLogin, setActiveLogin] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = (clientType: string) => {
    console.log(`Login attempted for ${clientType}`);
    setActiveLogin(null);
    
    // Navigate to appropriate dashboard based on client type
    if (clientType === 'tracks') {
      navigate('/track-dashboard');
    } else if (clientType === 'trainers') {
      navigate('/trainer-dashboard');
    }
  };

  const toggleLogin = (clientType: string) => {
    setActiveLogin(activeLogin === clientType ? null : clientType);
  };

  const getColorScheme = (type: string) => {
    switch (type) {
      case 'tracks':
        return {
          button: "border-blue-200/60 text-blue-600 hover:bg-blue-50/80 hover:border-blue-300 backdrop-blur-sm",
          box: "bg-gradient-to-br from-blue-50/95 to-blue-100/95 border-blue-200/60 backdrop-blur-lg",
          input: "border-blue-200/60 focus:border-blue-400 bg-white/70 backdrop-blur-sm",
          submitButton: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25",
          text: "text-blue-700",
          link: "text-blue-600 hover:text-blue-700"
        };
      case 'vets':
        return {
          button: "border-purple-200/60 text-purple-600 hover:bg-purple-50/80 hover:border-purple-300 backdrop-blur-sm",
          box: "bg-gradient-to-br from-purple-50/95 to-purple-100/95 border-purple-200/60 backdrop-blur-lg",
          input: "border-purple-200/60 focus:border-purple-400 bg-white/70 backdrop-blur-sm",
          submitButton: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/25",
          text: "text-purple-700",
          link: "text-purple-600 hover:text-purple-700"
        };
      case 'trainers':
        return {
          button: "border-orange-200/60 text-orange-600 hover:bg-orange-50/80 hover:border-orange-300 backdrop-blur-sm",
          box: "bg-gradient-to-br from-orange-50/95 to-orange-100/95 border-orange-200/60 backdrop-blur-lg",
          input: "border-orange-200/60 focus:border-orange-400 bg-white/70 backdrop-blur-sm",
          submitButton: "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg shadow-orange-500/25",
          text: "text-orange-700",
          link: "text-orange-600 hover:text-orange-700"
        };
      default:
        return {};
    }
  };

  const getLoginTitle = (type: string) => {
    switch (type) {
      case 'tracks': return 'Track Login';
      case 'vets': return 'Veterinarian Login';
      case 'trainers': return 'Trainer Login';
      default: return 'Login';
    }
  };

  return (
    <div className="relative">
      <header className="w-full bg-white/90 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent tracking-tight">
              StrideSafe USA
            </div>
            <nav className="flex items-center gap-6">
              <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                <span>Client Portal:</span>
              </div>
              
              {/* Tracks Login */}
              <Button 
                variant="outline" 
                size="sm" 
                className={`${getColorScheme('tracks').button} transition-all duration-300 font-medium`}
                onClick={() => toggleLogin('tracks')}
              >
                <LogIn className="w-3.5 h-3.5 mr-2" />
                Tracks
              </Button>

              {/* Vets Login */}
              <Button 
                variant="outline" 
                size="sm" 
                className={`${getColorScheme('vets').button} transition-all duration-300 font-medium`}
                onClick={() => toggleLogin('vets')}
              >
                <LogIn className="w-3.5 h-3.5 mr-2" />
                Vets
              </Button>

              {/* Trainers Login */}
              <Button 
                variant="outline" 
                size="sm" 
                className={`${getColorScheme('trainers').button} transition-all duration-300 font-medium`}
                onClick={() => toggleLogin('trainers')}
              >
                <LogIn className="w-3.5 h-3.5 mr-2" />
                Trainers
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Expanding Login Box */}
      <div className={`absolute top-full left-0 right-0 z-40 overflow-hidden transition-all duration-500 ease-out ${
        activeLogin ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        {activeLogin && (
          <div className={`${getColorScheme(activeLogin).box} border-t-0 shadow-xl shadow-gray-900/10`}>
            <div className="max-w-7xl mx-auto px-8 py-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className={`text-2xl font-bold ${getColorScheme(activeLogin).text} tracking-tight`}>
                    {getLoginTitle(activeLogin)}
                  </h3>
                  <p className={`text-sm ${getColorScheme(activeLogin).text} opacity-75 font-medium mt-1`}>
                    Access your management dashboard
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveLogin(null)}
                  className={`${getColorScheme(activeLogin).text} hover:bg-white/60 backdrop-blur-sm transition-all duration-200`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="max-w-lg space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor={`${activeLogin}-email`} className={`${getColorScheme(activeLogin).text} font-semibold text-sm`}>
                      Email Address
                    </Label>
                    <Input 
                      id={`${activeLogin}-email`} 
                      type="email" 
                      placeholder={`${activeLogin}@example.com`}
                      className={`${getColorScheme(activeLogin).input} transition-all duration-200 focus:ring-2 focus:ring-offset-1`}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor={`${activeLogin}-password`} className={`${getColorScheme(activeLogin).text} font-semibold text-sm`}>
                      Password
                    </Label>
                    <Input 
                      id={`${activeLogin}-password`} 
                      type="password" 
                      className={`${getColorScheme(activeLogin).input} transition-all duration-200 focus:ring-2 focus:ring-offset-1`}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <Button 
                    className={`${getColorScheme(activeLogin).submitButton} px-8 py-2.5 font-semibold transition-all duration-200 hover:scale-105`}
                    onClick={() => handleLogin(activeLogin)}
                  >
                    Sign In
                  </Button>
                  <a href="#" className={`text-sm ${getColorScheme(activeLogin).link} font-medium hover:underline transition-all duration-200`}>
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
