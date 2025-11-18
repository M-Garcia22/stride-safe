
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { 
  LayoutDashboard, 
  Flag, 
  Users, 
  Stethoscope, 
  Shield, 
  Heart,
  Box,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Sun,
  Moon,
  Contrast
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/contexts/ThemeContext";
import { DashboardPane } from "@/pages/TrackDashboard";

interface TrackSidebarProps {
  activePane: DashboardPane;
  onPaneChange: (pane: DashboardPane) => void;
}

const menuItems = [
  {
    id: "overview" as DashboardPane,
    title: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "races" as DashboardPane,
    title: "Racecard",
    icon: Flag,
  },
  {
    id: "alerts" as DashboardPane,
    title: "Welfare Alerts",
    icon: AlertTriangle,
  },
  {
    id: "veterinary" as DashboardPane,
    title: "Pre-race Examination",
    icon: Stethoscope,
  },
  {
    id: "safety" as DashboardPane,
    title: "Post-race Reports",
    icon: Shield,
  },
  {
    id: "individual" as DashboardPane,
    title: "Individual Analysis",
    icon: TrendingUp,
  },
  {
    id: "blackbox" as DashboardPane,
    title: "BlackBox",
    icon: Box,
  },
  {
    id: "tracksafe" as DashboardPane,
    title: "TrackSAFE",
    icon: ShieldCheck,
  },
  {
    id: "horses" as DashboardPane,
    title: "Horse Registry",
    icon: Users,
  },
];

const TrackSidebar = ({ activePane, onPaneChange }: TrackSidebarProps) => {
  const { theme, contrastMode, toggleTheme, toggleContrastMode } = useTheme();

  return (
    <TooltipProvider>
      <Sidebar className="border-r" collapsible="icon">
        <SidebarHeader className="border-b p-6 bg-card">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-3 rounded-lg group-data-[collapsible=icon]:p-2">
              <Heart className="w-8 h-8 text-primary-foreground group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6" />
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <h1 className="text-xl font-bold text-foreground">
                Welfare<sup className="text-amber-600">Pro</sup>
              </h1>
              <p className="text-sm text-muted-foreground">Dashboard</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="bg-sidebar">
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground font-medium">
              Dashboard
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activePane === item.id}
                      onClick={() => onPaneChange(item.id)}
                      className={`w-full transition-all duration-200 h-12 ${
                        activePane === item.id 
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 shadow-lg font-medium' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      } justify-start px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center`}
                      tooltip={item.title}
                    >
                      <item.icon className="w-6 h-6 flex-shrink-0 group-data-[collapsible=icon]:mx-auto" />
                      <span className="text-base group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t p-3 bg-sidebar">
          <div className="space-y-3 group-data-[collapsible=icon]:space-y-2">
            {/* Dark Mode Toggle */}
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 group-data-[collapsible=icon]:gap-0">
                    {theme === 'light' ? <Sun className="w-3 h-3 text-sidebar-foreground" /> : <Moon className="w-3 h-3 text-sidebar-foreground" />}
                    <Switch
                      checked={theme === 'dark'}
                      onCheckedChange={toggleTheme}
                      className="h-4 w-7 data-[state=checked]:bg-primary group-data-[collapsible=icon]:ml-0 [&>span]:h-3 [&>span]:w-3 data-[state=checked]:[&>span]:translate-x-3 data-[state=unchecked]:[&>span]:translate-x-0"
                    />
                    <span className="text-xs text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                      {theme === 'light' ? 'Light' : 'Dark'} Mode
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* High Contrast Toggle */}
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 group-data-[collapsible=icon]:gap-0">
                    <Contrast className="w-3 h-3 text-sidebar-foreground" />
                    <Switch
                      checked={contrastMode === 'high'}
                      onCheckedChange={toggleContrastMode}
                      className="h-4 w-7 data-[state=checked]:bg-amber-600 group-data-[collapsible=icon]:ml-0 [&>span]:h-3 [&>span]:w-3 data-[state=checked]:[&>span]:translate-x-3 data-[state=unchecked]:[&>span]:translate-x-0"
                    />
                    <span className="text-xs text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                      Bright Conditions
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>High Contrast for Bright Conditions</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
};

export default TrackSidebar;
