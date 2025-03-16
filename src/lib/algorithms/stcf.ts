// src/lib/algorithms/stcf.ts
import { Process, AlgorithmResult, GanttItem, TimelineEvent } from '../../types';
import { prepareProcesses } from '../processUtils';

export const runSTCF = (processes: Process[]): AlgorithmResult => {
  // Make a deep copy of processes to avoid modifying original
  const processesCopy = prepareProcesses(processes);
  let currentTime = 0;
  const timeline: TimelineEvent[] = [];
  const ganttChart: GanttItem[] = [];
  const completed = new Array(processesCopy.length).fill(false);
  
  let completedCount = 0;
  let currentProcess: Process | null = null;
  let previousProcess: Process | null = null;

  
  // Continue until all processes are completed
  while (completedCount < processesCopy.length) {
    // Find the process with shortest remaining time among arrived processes
    let shortestIndex = -1;
    let shortestRemaining = Infinity;
    
    for (let i = 0; i < processesCopy.length; i++) {
      const process = processesCopy[i];
      
      // If process has arrived and not completed yet
      if (!completed[i] && process.arrivalTime <= currentTime) {
        if (process.remainingTime! < shortestRemaining) {
          shortestRemaining = process.remainingTime!;
          shortestIndex = i;
        }
      }
    }
    
    // If no process is available at current time
    if (shortestIndex === -1) {
      // Find the next process to arrive
      let nextArrivalTime = Infinity;
      
      for (let i = 0; i < processesCopy.length; i++) {
        if (!completed[i] && processesCopy[i].arrivalTime < nextArrivalTime) {
          nextArrivalTime = processesCopy[i].arrivalTime;
        }
      }
      
      // Add idle time to Gantt chart
      ganttChart.push({
        id: 'Idle',
        start: currentTime,
        end: nextArrivalTime,
        color: '#cccccc'
      });
      
      timeline.push({
        time: currentTime,
        action: `CPU idle until ${nextArrivalTime}`
      });
      
      currentTime = nextArrivalTime;
      continue;
    }
    
    currentProcess = processesCopy[shortestIndex];
    
    // Record response time if process is getting CPU for the first time
    if (currentProcess.responseTime === -1) {
      currentProcess.responseTime = currentTime - currentProcess.arrivalTime;
    }
    
    // Check for context switch
    if (previousProcess !== null && previousProcess !== currentProcess) {
      timeline.push({
        time: currentTime,
        action: `Context switch: ${previousProcess.id} preempted, ${currentProcess.id} starts/resumes`
      });
    } else if (previousProcess === null) {
      timeline.push({
        time: currentTime,
        action: `Process ${currentProcess.id} starts execution`
      });
    }
    
    // Determine how long this process will run
    // Either until it completes, or until a new process arrives that has shorter remaining time
    let runUntil = currentTime + currentProcess.remainingTime!;
    
    // Check if any process with shorter remaining time will arrive before this one completes
    for (let i = 0; i < processesCopy.length; i++) {
      const process = processesCopy[i];
      
      if (!completed[i] && process !== currentProcess && process.arrivalTime > currentTime && process.arrivalTime < runUntil) {
        // Check if this arriving process will have shorter remaining time
        const currentRemaining = currentProcess.remainingTime! - (process.arrivalTime - currentTime);
        if (process.remainingTime! < currentRemaining) {
          runUntil = process.arrivalTime;
        }
      }
    }
    
    // Calculate actual execution time in this cycle
    const executeTime = runUntil - currentTime;
    
    // Add to Gantt chart
    ganttChart.push({
      id: currentProcess.id,
      start: currentTime,
      end: runUntil,
      color: currentProcess.color || '#3498db'
    });
    
 
    currentTime = runUntil;
    currentProcess.remainingTime! -= executeTime;
    

    if (currentProcess.remainingTime === 0) {
      currentProcess.completionTime = currentTime;
      currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
      currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
      
      timeline.push({
        time: currentTime,
        action: `Process ${currentProcess.id} completes execution`
      });
      
      completed[shortestIndex] = true;
      completedCount++;
    } else {
      timeline.push({
        time: currentTime,
        action: `Process ${currentProcess.id} is preempted, remaining: ${currentProcess.remainingTime}`
      });
    }
    
    previousProcess = currentProcess;
  }
  
  const avgTurnaroundTime = processesCopy.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0) / processesCopy.length;
  const avgWaitingTime = processesCopy.reduce((sum, p) => sum + (p.waitingTime || 0), 0) / processesCopy.length;
  const avgResponseTime = processesCopy.reduce((sum, p) => sum + (p.responseTime || 0), 0) / processesCopy.length;
  
  return {
    processes: processesCopy,
    timeline,
    ganttChart,
    metrics: {
      avgTurnaroundTime,
      avgWaitingTime,
      avgResponseTime
    }
  };
};