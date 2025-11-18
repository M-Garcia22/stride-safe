
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import TrackDashboard from "./pages/TrackDashboard";
import TrainerDashboard from "./pages/TrainerDashboard";
import TracksLogin from "./pages/TracksLogin";
import TrainersLogin from "./pages/TrainersLogin";
import VetsLogin from "./pages/VetsLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tracks-login" element={<TracksLogin />} />
            <Route path="/trainers-login" element={<TrainersLogin />} />
            <Route path="/vets-login" element={<VetsLogin />} />
            <Route 
              path="/track-dashboard" 
              element={
                <ProtectedRoute allowedUserTypes={['track']}>
                  <TrackDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/trainer-dashboard" 
              element={
                <ProtectedRoute allowedUserTypes={['trainer']}>
                  <TrainerDashboard />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
