import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Mail, Plus, X, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface AutomatedReportingProps {
  onScheduleReport: (config: ScheduledReportConfig) => void;
}

export interface ScheduledReportConfig {
  id?: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  time: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  recipients: string[];
  format: 'pdf' | 'csv' | 'both';
  includeCharts: boolean;
  active: boolean;
}

const AutomatedReporting = ({ onScheduleReport }: AutomatedReportingProps) => {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<ScheduledReportConfig[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newSchedule, setNewSchedule] = useState<ScheduledReportConfig>({
    name: '',
    description: '',
    frequency: 'weekly',
    time: '09:00',
    recipients: [],
    format: 'pdf',
    includeCharts: true,
    active: true
  });
  const [newRecipient, setNewRecipient] = useState('');

  const addRecipient = () => {
    if (newRecipient && !newSchedule.recipients.includes(newRecipient)) {
      setNewSchedule(prev => ({
        ...prev,
        recipients: [...prev.recipients, newRecipient]
      }));
      setNewRecipient('');
    }
  };

  const removeRecipient = (email: string) => {
    setNewSchedule(prev => ({
      ...prev,
      recipients: prev.recipients.filter(r => r !== email)
    }));
  };

  const handleCreateSchedule = () => {
    if (newSchedule.name && newSchedule.recipients.length > 0) {
      const config = {
        ...newSchedule,
        id: Date.now().toString()
      };
      
      setSchedules(prev => [...prev, config]);
      onScheduleReport(config);
      
      // Reset form
      setNewSchedule({
        name: '',
        description: '',
        frequency: 'weekly',
        time: '09:00',
        recipients: [],
        format: 'pdf',
        includeCharts: true,
        active: true
      });
      setIsCreating(false);
      
      toast({
        title: "Schedule Created",
        description: `Report "${config.name}" has been scheduled`,
      });
    }
  };

  const toggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id 
        ? { ...schedule, active: !schedule.active }
        : schedule
    ));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    toast({
      title: "Schedule Deleted",
      description: "Automated report has been removed",
    });
  };

  const getFrequencyDescription = (config: ScheduledReportConfig) => {
    switch (config.frequency) {
      case 'daily':
        return `Daily at ${config.time}`;
      case 'weekly':
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `Weekly on ${days[config.dayOfWeek || 1]} at ${config.time}`;
      case 'monthly':
        return `Monthly on day ${config.dayOfMonth || 1} at ${config.time}`;
      case 'quarterly':
        return `Quarterly on day ${config.dayOfMonth || 1} at ${config.time}`;
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Automated Reporting
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2"
            aria-label={isCreating ? "Cancel creating schedule" : "Create new schedule"}
          >
            {isCreating ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isCreating ? 'Cancel' : 'New Schedule'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Schedules */}
        {schedules.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Active Schedules</Label>
            {schedules.map(schedule => (
              <div 
                key={schedule.id} 
                className="flex items-center justify-between p-3 border rounded-lg"
                role="region"
                aria-labelledby={`schedule-${schedule.id}-name`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 id={`schedule-${schedule.id}-name`} className="font-medium">
                      {schedule.name}
                    </h4>
                    <Badge variant={schedule.active ? "default" : "secondary"}>
                      {schedule.active ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getFrequencyDescription(schedule)} • {schedule.recipients.length} recipients
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSchedule(schedule.id!)}
                    aria-label={schedule.active ? "Pause schedule" : "Resume schedule"}
                  >
                    {schedule.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSchedule(schedule.id!)}
                    className="text-destructive hover:text-destructive"
                    aria-label="Delete schedule"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create New Schedule Form */}
        {isCreating && (
          <div className="border rounded-lg p-4 space-y-4" role="form" aria-labelledby="new-schedule-title">
            <h3 id="new-schedule-title" className="font-medium">Create New Schedule</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schedule-name">Schedule Name</Label>
                <Input
                  id="schedule-name"
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Weekly Safety Report"
                  aria-describedby="schedule-name-desc"
                />
                <span id="schedule-name-desc" className="sr-only">
                  Enter a descriptive name for this automated report schedule
                </span>
              </div>
              
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select 
                  value={newSchedule.frequency} 
                  onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'quarterly') => 
                    setNewSchedule(prev => ({ ...prev, frequency: value }))
                  }
                >
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
                  aria-describedby="time-desc"
                />
                <span id="time-desc" className="sr-only">
                  Select the time when reports should be sent
                </span>
              </div>
              
              {(newSchedule.frequency === 'weekly') && (
                <div>
                  <Label htmlFor="day-of-week">Day of Week</Label>
                  <Select 
                    value={newSchedule.dayOfWeek?.toString() || '1'} 
                    onValueChange={(value) => 
                      setNewSchedule(prev => ({ ...prev, dayOfWeek: parseInt(value) }))
                    }
                  >
                    <SelectTrigger id="day-of-week">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sunday</SelectItem>
                      <SelectItem value="1">Monday</SelectItem>
                      <SelectItem value="2">Tuesday</SelectItem>
                      <SelectItem value="3">Wednesday</SelectItem>
                      <SelectItem value="4">Thursday</SelectItem>
                      <SelectItem value="5">Friday</SelectItem>
                      <SelectItem value="6">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {(newSchedule.frequency === 'monthly' || newSchedule.frequency === 'quarterly') && (
                <div>
                  <Label htmlFor="day-of-month">Day of Month</Label>
                  <Input
                    id="day-of-month"
                    type="number"
                    min="1"
                    max="31"
                    value={newSchedule.dayOfMonth || 1}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, dayOfMonth: parseInt(e.target.value) }))}
                    aria-describedby="day-of-month-desc"
                  />
                  <span id="day-of-month-desc" className="sr-only">
                    Enter the day of the month when reports should be sent
                  </span>
                </div>
              )}
              
              <div>
                <Label htmlFor="format">Format</Label>
                <Select 
                  value={newSchedule.format} 
                  onValueChange={(value: 'pdf' | 'csv' | 'both') => 
                    setNewSchedule(prev => ({ ...prev, format: value }))
                  }
                >
                  <SelectTrigger id="format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Only</SelectItem>
                    <SelectItem value="csv">CSV Only</SelectItem>
                    <SelectItem value="both">PDF + CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newSchedule.description}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional context for this report"
                rows={2}
                aria-describedby="description-desc"
              />
              <span id="description-desc" className="sr-only">
                Optional description providing context for this automated report
              </span>
            </div>

            <div>
              <Label>Recipients</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  placeholder="email@example.com"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addRecipient();
                    }
                  }}
                  aria-label="Add recipient email address"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addRecipient}
                  aria-label="Add recipient to list"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {newSchedule.recipients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2" role="list" aria-label="Report recipients">
                  {newSchedule.recipients.map(email => (
                    <Badge 
                      key={email} 
                      variant="secondary" 
                      className="flex items-center gap-1"
                      role="listitem"
                    >
                      <Mail className="h-3 w-3" />
                      {email}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeRecipient(email)}
                        aria-label={`Remove ${email} from recipients`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-charts"
                  checked={newSchedule.includeCharts}
                  onCheckedChange={(checked) => setNewSchedule(prev => ({ ...prev, includeCharts: checked }))}
                  aria-describedby="include-charts-desc"
                />
                <Label htmlFor="include-charts">Include Charts</Label>
                <span id="include-charts-desc" className="sr-only">
                  Toggle whether to include visual charts in the automated reports
                </span>
              </div>
              
              <Button 
                onClick={handleCreateSchedule}
                disabled={!newSchedule.name || newSchedule.recipients.length === 0}
                className="flex items-center gap-2"
                aria-describedby="create-schedule-desc"
              >
                <Calendar className="h-4 w-4" />
                Create Schedule
              </Button>
              <span id="create-schedule-desc" className="sr-only">
                Create the automated report schedule with the specified settings
              </span>
            </div>
          </div>
        )}

        {schedules.length === 0 && !isCreating && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No Automated Reports</p>
            <p className="text-sm">Create your first scheduled report to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutomatedReporting;
