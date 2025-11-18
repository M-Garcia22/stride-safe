import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Users, BarChart3, UserCheck, Sun, Moon, Contrast, Building2 } from "lucide-react";
import { TrainerDashboardPane } from "@/pages/TrainerDashboard";
import { useTheme } from "@/contexts/ThemeContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TrainerSidebarProps {
  activePane: TrainerDashboardPane;
  onPaneChange: (pane: TrainerDashboardPane) => void;
}

const menuItems = [{
  id: "overview" as TrainerDashboardPane,
  title: "Overview",
  icon: LayoutDashboard
}, {
  id: "horses" as TrainerDashboardPane,
  title: "My Horses",
  icon: Building2
}, {
  id: "stable" as TrainerDashboardPane,
  title: "My Stable",
  icon: Users
}, {
  id: "analytics" as TrainerDashboardPane,
  title: "Horse Analysis",
  icon: BarChart3
}, {
  id: "access-manager" as TrainerDashboardPane,
  title: "Access Manager",
  icon: UserCheck
}];

const TrainerSidebar = ({
  activePane,
  onPaneChange
}: TrainerSidebarProps) => {
  const {
    theme,
    contrastMode,
    toggleTheme,
    toggleContrastMode
  } = useTheme();

  return <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader 
        className="border-b p-6 bg-card group-data-[collapsible=icon]:p-3 h-20 flex items-center justify-center transition-all duration-200"
        role="banner"
        aria-label="Trainer Dashboard Header"
      >
        <div className="flex items-center gap-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
          <div className="bg-primary p-3 rounded-xl shadow-md group-data-[collapsible=icon]:p-2.5 transition-all duration-200 hover:shadow-lg">
            <Building2 className="w-8 h-8 text-primary-foreground group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6 transition-all duration-200" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden min-w-0 flex-1 transition-opacity duration-200">
            <h1 className="text-2xl text-foreground leading-tight tracking-tight">
              <span className="font-light">Trainer</span><span className="font-normal">Hub</span>
            </h1>
            <div className="mt-0">
              <Badge className="bg-gray-200 text-gray-700 text-xs px-1.5 py-0.5 font-medium hover:bg-gray-200">
                Prototype
              </Badge>
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground font-medium text-xs uppercase tracking-wider">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activePane === item.id} 
                    onClick={() => onPaneChange(item.id)} 
                    className={`w-full transition-all duration-200 h-11 ${
                      activePane === item.id 
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md font-medium border-l-4 border-l-primary-foreground/20' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1'
                    } justify-start px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none`} 
                    tooltip={item.title}
                    aria-label={`Navigate to ${item.title}`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0 group-data-[collapsible=icon]:mx-auto transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-sm font-medium group-data-[collapsible=icon]:hidden transition-all duration-200">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t bg-card group-data-[collapsible=icon]:p-2">
        <TooltipProvider>
          <div className="space-y-2 group-data-[collapsible=icon]:space-y-1.5">
            {/* Dark Mode Toggle */}
            <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center p-2 rounded-lg hover:bg-accent/50 transition-colors duration-200">
                    {theme === 'light' ? <Sun className="w-4 h-4 text-muted-foreground" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
                    <Switch 
                      checked={theme === 'dark'} 
                      onCheckedChange={toggleTheme} 
                      className="data-[state=checked]:bg-primary scale-75 group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:scale-60 transition-all duration-200" 
                      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    />
                    <span className="text-xs text-muted-foreground font-medium group-data-[collapsible=icon]:hidden">
                      {theme === 'light' ? 'Dark' : 'Light'}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="group-data-[collapsible=expanded]:hidden">
                  <p>Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* High Contrast Toggle */}
            <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center p-2 rounded-lg hover:bg-accent/50 transition-colors duration-200">
                    <Contrast className="w-4 h-4 text-muted-foreground" />
                    <Switch 
                      checked={contrastMode === 'high'} 
                      onCheckedChange={toggleContrastMode} 
                      className="data-[state=checked]:bg-amber-600 scale-75 group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:scale-60 transition-all duration-200" 
                      aria-label={`Toggle ${contrastMode === 'high' ? 'normal' : 'high'} contrast mode`}
                    />
                    <span className="text-xs text-muted-foreground font-medium group-data-[collapsible=icon]:hidden">
                      High Contrast
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="group-data-[collapsible=expanded]:hidden">
                  <p>High Contrast for Bright Conditions</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>
      </SidebarFooter>
    </Sidebar>;
};

export default TrainerSidebar;
