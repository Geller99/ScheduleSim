// src/lib/algorithms/sjf.ts
import { Process, AlgorithmResult, GanttItem, TimelineEvent } from '../../types';
import { prepareProcesses } from '../processUtils';

export const runSJF = (processes: Process[]): AlgorithmResult => {
  // Make a deep copy of processes to avoid modifying original
  const processesCopy = prepareProcesses(processes);
  let currentTime = 0;
  const timeline: TimelineEvent[] = [];
  const ganttChart: GanttItem[] = [];
  const completed = new Array(processesCopy.length).fill(false);
  
  let completedCount = 0;
  
  // Sort initially by arrival time to process in chronological order
  processesCopy.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  // Continue until all processes are completed
  while (completedCount < processesCopy.length) {
    // Find the shortest job among the arrived processes
    let shortestIndex = -1;
    let shortestBurstTime = Infinity;
    
    for (let i = 0; i < processesCopy.length; i++) {
      const process = processesCopy[i];
      
      // If process has arrived and not completed yet
      if (!completed[i] && process.arrivalTime <= currentTime) {
        if (process.burstTime < shortestBurstTime) {
          shortestBurstTime = process.burstTime;
          shortestIndex = i;
        }
      }
    }
    
    // If no process is available at current time
    if (shortestIndex === -1) {
      // Find the next process to arrive
      let nextArrivalTime = Infinity;
      let nextIndex = -1;
      
      for (let i = 0; i < processesCopy.length; i++) {
        if (!completed[i] && processesCopy[i].arrivalTime < nextArrivalTime) {
          nextArrivalTime = processesCopy[i].arrivalTime;
          nextIndex = i;
        }
      }
      
      // Add idle time to Gantt chart
      if (nextIndex !== -1) {
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
      }
      continue;
    }
    
    const process = processesCopy[shortestIndex];
    process.responseTime = currentTime - process.arrivalTime;
    timeline.push({
      time: currentTime,
      action: `Process ${process.id} starts execution`
    });
    
    // Add to Gantt chart
    ganttChart.push({
      id: process.id,
      start: currentTime,
      end: currentTime + process.burstTime,
      color: process.color || '#3498db'
    });
    
    // Update time and mark as completed
    currentTime += process.burstTime;
    process.completionTime = currentTime;
    process.turnaroundTime = process.completionTime - process.arrivalTime;
    process.waitingTime = process.turnaroundTime - process.burstTime;
    
    timeline.push({
      time: currentTime,
      action: `Process ${process.id} completes execution`
    });
    
    completed[shortestIndex] = true;
    completedCount++;
  }
  
  // Calculate average metrics
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