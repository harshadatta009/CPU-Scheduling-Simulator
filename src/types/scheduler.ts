export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  remainingTime?: number;
  completionTime?: number;
  turnaroundTime?: number;
  waitingTime?: number;
  responseTime?: number;
  startTime?: number;
}

export interface GanttChartItem {
  processId: string;
  startTime: number;
  endTime: number;
  color: string;
}

export interface SchedulingResult {
  processes: Process[];
  ganttChart: GanttChartItem[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  totalTime: number;
}

export type SchedulingAlgorithm = 
  | 'FCFS' 
  | 'SJF_NON_PREEMPTIVE' 
  | 'SJF_PREEMPTIVE' 
  | 'PRIORITY_NON_PREEMPTIVE' 
  | 'PRIORITY_PREEMPTIVE' 
  | 'ROUND_ROBIN';

export interface SimulationStep {
  time: number;
  currentProcess?: string;
  readyQueue: string[];
  action: string;
  description: string;
}