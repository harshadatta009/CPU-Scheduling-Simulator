import { Process, GanttChartItem, SchedulingResult, SchedulingAlgorithm } from '../types/scheduler';

const PROCESS_COLORS = [
  'hsl(var(--chart-primary))',
  'hsl(var(--chart-secondary))',
  'hsl(var(--chart-accent))',
  'hsl(var(--chart-success))',
  'hsl(var(--chart-warning))',
  'hsl(var(--chart-error))',
  'hsl(263 70% 50%)',
  'hsl(280 80% 60%)',
  'hsl(200 100% 60%)',
  'hsl(142 76% 46%)',
];

export function getProcessColor(index: number): string {
  return PROCESS_COLORS[index % PROCESS_COLORS.length];
}

export function calculateMetrics(processes: Process[]): {
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
} {
  const totalProcesses = processes.length;
  const totalWaitingTime = processes.reduce((sum, p) => sum + (p.waitingTime || 0), 0);
  const totalTurnaroundTime = processes.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0);
  const totalResponseTime = processes.reduce((sum, p) => sum + (p.responseTime || 0), 0);

  return {
    averageWaitingTime: totalWaitingTime / totalProcesses,
    averageTurnaroundTime: totalTurnaroundTime / totalProcesses,
    averageResponseTime: totalResponseTime / totalProcesses,
  };
}

export function fcfsScheduling(processes: Process[]): SchedulingResult {
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const ganttChart: GanttChartItem[] = [];
  let currentTime = 0;

  sortedProcesses.forEach((process, index) => {
    const startTime = Math.max(currentTime, process.arrivalTime);
    const endTime = startTime + process.burstTime;

    process.startTime = startTime;
    process.completionTime = endTime;
    process.turnaroundTime = endTime - process.arrivalTime;
    process.waitingTime = startTime - process.arrivalTime;
    process.responseTime = startTime - process.arrivalTime;

    ganttChart.push({
      processId: process.id,
      startTime,
      endTime,
      color: getProcessColor(index),
    });

    currentTime = endTime;
  });

  const metrics = calculateMetrics(sortedProcesses);

  return {
    processes: sortedProcesses,
    ganttChart,
    totalTime: currentTime,
    ...metrics,
  };
}

export function sjfNonPreemptiveScheduling(processes: Process[]): SchedulingResult {
  const processList = [...processes];
  const ganttChart: GanttChartItem[] = [];
  const completed: Process[] = [];
  let currentTime = 0;

  while (completed.length < processes.length) {
    const availableProcesses = processList.filter(
      p => p.arrivalTime <= currentTime && !completed.includes(p)
    );

    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    const shortestJob = availableProcesses.reduce((min, p) => 
      p.burstTime < min.burstTime ? p : min
    );

    const startTime = currentTime;
    const endTime = startTime + shortestJob.burstTime;

    shortestJob.startTime = startTime;
    shortestJob.completionTime = endTime;
    shortestJob.turnaroundTime = endTime - shortestJob.arrivalTime;
    shortestJob.waitingTime = startTime - shortestJob.arrivalTime;
    shortestJob.responseTime = startTime - shortestJob.arrivalTime;

    const processIndex = processes.findIndex(p => p.id === shortestJob.id);
    ganttChart.push({
      processId: shortestJob.id,
      startTime,
      endTime,
      color: getProcessColor(processIndex),
    });

    completed.push(shortestJob);
    currentTime = endTime;
  }

  const metrics = calculateMetrics(completed);

  return {
    processes: completed,
    ganttChart,
    totalTime: currentTime,
    ...metrics,
  };
}

export function sjfPreemptiveScheduling(processes: Process[]): SchedulingResult {
  const processList = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  const ganttChart: GanttChartItem[] = [];
  const completed: Process[] = [];
  let currentTime = 0;

  while (completed.length < processes.length) {
    const availableProcesses = processList.filter(
      p => p.arrivalTime <= currentTime && p.remainingTime! > 0
    );

    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    const shortestJob = availableProcesses.reduce((min, p) => 
      p.remainingTime! < min.remainingTime! ? p : min
    );

    if (shortestJob.startTime === undefined) {
      shortestJob.startTime = currentTime;
      shortestJob.responseTime = currentTime - shortestJob.arrivalTime;
    }

    const startTime = currentTime;
    shortestJob.remainingTime!--;
    currentTime++;

    if (shortestJob.remainingTime === 0) {
      shortestJob.completionTime = currentTime;
      shortestJob.turnaroundTime = currentTime - shortestJob.arrivalTime;
      shortestJob.waitingTime = shortestJob.turnaroundTime - shortestJob.burstTime;
      completed.push(shortestJob);
    }

    const lastGanttItem = ganttChart[ganttChart.length - 1];
    if (lastGanttItem && lastGanttItem.processId === shortestJob.id) {
      lastGanttItem.endTime = currentTime;
    } else {
      const processIndex = processes.findIndex(p => p.id === shortestJob.id);
      ganttChart.push({
        processId: shortestJob.id,
        startTime,
        endTime: currentTime,
        color: getProcessColor(processIndex),
      });
    }
  }

  const metrics = calculateMetrics(completed);

  return {
    processes: completed,
    ganttChart,
    totalTime: currentTime,
    ...metrics,
  };
}

export function priorityNonPreemptiveScheduling(processes: Process[]): SchedulingResult {
  const processList = [...processes];
  const ganttChart: GanttChartItem[] = [];
  const completed: Process[] = [];
  let currentTime = 0;

  while (completed.length < processes.length) {
    const availableProcesses = processList.filter(
      p => p.arrivalTime <= currentTime && !completed.includes(p)
    );

    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    const highestPriority = availableProcesses.reduce((max, p) => 
      (p.priority || 0) > (max.priority || 0) ? p : max
    );

    const startTime = currentTime;
    const endTime = startTime + highestPriority.burstTime;

    highestPriority.startTime = startTime;
    highestPriority.completionTime = endTime;
    highestPriority.turnaroundTime = endTime - highestPriority.arrivalTime;
    highestPriority.waitingTime = startTime - highestPriority.arrivalTime;
    highestPriority.responseTime = startTime - highestPriority.arrivalTime;

    const processIndex = processes.findIndex(p => p.id === highestPriority.id);
    ganttChart.push({
      processId: highestPriority.id,
      startTime,
      endTime,
      color: getProcessColor(processIndex),
    });

    completed.push(highestPriority);
    currentTime = endTime;
  }

  const metrics = calculateMetrics(completed);

  return {
    processes: completed,
    ganttChart,
    totalTime: currentTime,
    ...metrics,
  };
}

export function priorityPreemptiveScheduling(processes: Process[]): SchedulingResult {
  const processList = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  const ganttChart: GanttChartItem[] = [];
  const completed: Process[] = [];
  let currentTime = 0;

  while (completed.length < processes.length) {
    const availableProcesses = processList.filter(
      p => p.arrivalTime <= currentTime && p.remainingTime! > 0
    );

    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    const highestPriority = availableProcesses.reduce((max, p) => 
      (p.priority || 0) > (max.priority || 0) ? p : max
    );

    if (highestPriority.startTime === undefined) {
      highestPriority.startTime = currentTime;
      highestPriority.responseTime = currentTime - highestPriority.arrivalTime;
    }

    const startTime = currentTime;
    highestPriority.remainingTime!--;
    currentTime++;

    if (highestPriority.remainingTime === 0) {
      highestPriority.completionTime = currentTime;
      highestPriority.turnaroundTime = currentTime - highestPriority.arrivalTime;
      highestPriority.waitingTime = highestPriority.turnaroundTime - highestPriority.burstTime;
      completed.push(highestPriority);
    }

    const lastGanttItem = ganttChart[ganttChart.length - 1];
    if (lastGanttItem && lastGanttItem.processId === highestPriority.id) {
      lastGanttItem.endTime = currentTime;
    } else {
      const processIndex = processes.findIndex(p => p.id === highestPriority.id);
      ganttChart.push({
        processId: highestPriority.id,
        startTime,
        endTime: currentTime,
        color: getProcessColor(processIndex),
      });
    }
  }

  const metrics = calculateMetrics(completed);

  return {
    processes: completed,
    ganttChart,
    totalTime: currentTime,
    ...metrics,
  };
}

export function roundRobinScheduling(processes: Process[], timeQuantum: number): SchedulingResult {
  const processList = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  const ganttChart: GanttChartItem[] = [];
  const completed: Process[] = [];
  const queue: Process[] = [];
  let currentTime = 0;

  // Add processes that arrive at time 0
  processList.forEach(p => {
    if (p.arrivalTime === 0) {
      queue.push(p);
    }
  });

  while (completed.length < processes.length || queue.length > 0) {
    // Add newly arrived processes to queue
    processList.forEach(p => {
      if (p.arrivalTime === currentTime && p.arrivalTime > 0 && !queue.includes(p) && p.remainingTime! > 0) {
        queue.push(p);
      }
    });

    if (queue.length === 0) {
      currentTime++;
      continue;
    }

    const currentProcess = queue.shift()!;
    
    if (currentProcess.startTime === undefined) {
      currentProcess.startTime = currentTime;
      currentProcess.responseTime = currentTime - currentProcess.arrivalTime;
    }

    const executionTime = Math.min(timeQuantum, currentProcess.remainingTime!);
    const startTime = currentTime;
    const endTime = startTime + executionTime;

    currentProcess.remainingTime! -= executionTime;
    currentTime = endTime;

    const processIndex = processes.findIndex(p => p.id === currentProcess.id);
    ganttChart.push({
      processId: currentProcess.id,
      startTime,
      endTime,
      color: getProcessColor(processIndex),
    });

    // Add newly arrived processes to queue
    processList.forEach(p => {
      if (p.arrivalTime <= currentTime && p.arrivalTime > startTime && !queue.includes(p) && p.remainingTime! > 0 && p !== currentProcess) {
        queue.push(p);
      }
    });

    if (currentProcess.remainingTime === 0) {
      currentProcess.completionTime = currentTime;
      currentProcess.turnaroundTime = currentTime - currentProcess.arrivalTime;
      currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
      completed.push(currentProcess);
    } else {
      queue.push(currentProcess);
    }
  }

  const metrics = calculateMetrics(completed);

  return {
    processes: completed,
    ganttChart,
    totalTime: currentTime,
    ...metrics,
  };
}

export function runSchedulingAlgorithm(
  algorithm: SchedulingAlgorithm,
  processes: Process[],
  timeQuantum: number = 2
): SchedulingResult {
  switch (algorithm) {
    case 'FCFS':
      return fcfsScheduling(processes);
    case 'SJF_NON_PREEMPTIVE':
      return sjfNonPreemptiveScheduling(processes);
    case 'SJF_PREEMPTIVE':
      return sjfPreemptiveScheduling(processes);
    case 'PRIORITY_NON_PREEMPTIVE':
      return priorityNonPreemptiveScheduling(processes);
    case 'PRIORITY_PREEMPTIVE':
      return priorityPreemptiveScheduling(processes);
    case 'ROUND_ROBIN':
      return roundRobinScheduling(processes, timeQuantum);
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
}