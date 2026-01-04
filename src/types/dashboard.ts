import { Report } from './report';

/**
 * Dashboard Pane Types
 */
export type TrainerDashboardPane = 
  | 'overview' 
  | 'horses'
  | 'stable'
  | 'analytics'
  | 'access-manager';

export type TrackDashboardPane = 
  | 'overview'
  | 'races'
  | 'horses'
  | 'safety'
  | 'settings'
  | 'individual-analysis'
  | 'black-box'
  | 'pre-race'
  | 'stride-analysis'
  | 'track-safe'
  | 'alert-horses';

/**
 * Common Dashboard Props
 */
export interface BasePaneProps<T extends string> {
  onPaneChange: (pane: T) => void;
}

export interface TrainerPaneProps extends BasePaneProps<TrainerDashboardPane> {
  onSelectHorse?: (horseName: string) => void;
  onSelectReport?: (report: Report) => void;
}

export interface TrackPaneProps extends BasePaneProps<TrackDashboardPane> {
  onSelectHorse?: (horseName: string) => void;
  onSelectReport?: (report: Report) => void;
}

/**
 * Sidebar Props
 */
export interface TrainerSidebarProps {
  activePane: TrainerDashboardPane;
  onPaneChange: (pane: TrainerDashboardPane) => void;
}

export interface TrackSidebarProps {
  activePane: TrackDashboardPane;
  onPaneChange: (pane: TrackDashboardPane) => void;
}

