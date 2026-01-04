import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types/user";
import { ROLE_CONFIG, ROLES } from "@/config/roles";

const Header: React.FC = () => {
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!activeRole) return;
    
    if (!email || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter your email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome back!",
        description: "Redirecting to your dashboard...",
      });
      
      resetForm();
      navigate(ROLE_CONFIG[activeRole].dashboardPath);
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveRole(null);
    setEmail("");
    setPassword("");
  };

  const toggleLogin = (role: UserRole) => {
    if (activeRole === role) {
      resetForm();
    } else {
      setActiveRole(role);
      setEmail("");
      setPassword("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const config = activeRole ? ROLE_CONFIG[activeRole] : null;

  return (
    <div className="relative">
      <header className="w-full bg-white/90 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent tracking-tight">
              StrideSafe USA
            </div>
            <nav className="flex items-center gap-6">
              <span className="text-sm text-gray-500 font-medium">
                Client Portal:
              </span>
              
              {ROLES.map((role) => (
                <Button
                  key={role}
                  variant="outline"
                  size="sm"
                  className={`${ROLE_CONFIG[role].colors.button} transition-all duration-300 font-medium`}
                  onClick={() => toggleLogin(role)}
                >
                  <LogIn className="w-3.5 h-3.5 mr-2" />
                  {ROLE_CONFIG[role].label}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Expanding Login Box */}
      <div
        className={`absolute top-full left-0 right-0 z-40 overflow-hidden transition-all duration-500 ease-out ${
          activeRole ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {config && (
          <div className={`${config.colors.box} border-t-0 shadow-xl shadow-gray-900/10`}>
            <div className="max-w-7xl mx-auto px-8 py-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className={`text-2xl font-bold ${config.colors.text} tracking-tight`}>
                    {config.loginTitle}
                  </h3>
                  <p className={`text-sm ${config.colors.text} opacity-75 font-medium mt-1`}>
                    Access your management dashboard
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  className={`${config.colors.text} hover:bg-white/60 backdrop-blur-sm transition-all duration-200`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form
                className="max-w-lg space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="login-email"
                      className={`${config.colors.text} font-semibold text-sm`}
                    >
                      Email Address
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${config.colors.input} transition-all duration-200 focus:ring-2 focus:ring-offset-1`}
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="login-password"
                      className={`${config.colors.text} font-semibold text-sm`}
                    >
                      Password
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${config.colors.input} transition-all duration-200 focus:ring-2 focus:ring-offset-1`}
                      disabled={loading}
                      onKeyDown={handleKeyDown}
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="submit"
                    className={`${config.colors.submitButton} px-8 py-2.5 font-semibold transition-all duration-200 hover:scale-105`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                  <a
                    href="#"
                    className={`text-sm ${config.colors.link} font-medium hover:underline transition-all duration-200`}
                  >
                    Forgot password?
                  </a>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
