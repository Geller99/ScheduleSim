// src/lib/algorithms/rr.ts
import { Process, AlgorithmResult, GanttItem, TimelineEvent } from '../../types';
import { prepareProcesses } from '../processUtils';

export const runRR = (processes: Process[], timeQuantum: number): AlgorithmResult => {
  // Make a deep copy of processes to avoid modifying original
  const processesCopy = prepareProcesses(processes);
  let currentTime = 0;
  const timeline: TimelineEvent[] = [];
  const ganttChart: GanttItem[] = [];
  
  // Ready queue to hold processes that have arrived but not completed
  const readyQueue: number[] = [];  // Stores process indices
  const completed = new Array(processesCopy.length).fill(false);
  let completedCount = 0;
  
  // Sort initially by arrival time
  processesCopy.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  // Continue until all processes are completed
  while (completedCount < processesCopy.length) {
    // Add newly arrived processes to the ready queue
    for (let i = 0; i < processesCopy.length; i++) {
      if (!completed[i] && processesCopy[i].arrivalTime <= currentTime && !readyQueue.includes(i)) {
        readyQueue.push(i);
      }
    }
    
    // If ready queue is empty, jump to the next process arrival
    if (readyQueue.length === 0) {
      let nextArrivalTime = Infinity;
      let nextProcessIndex = -1;
      
      for (let i = 0; i < processesCopy.length; i++) {
        if (!completed[i] && processesCopy[i].arrivalTime < nextArrivalTime) {
          nextArrivalTime = processesCopy[i].arrivalTime;
          nextProcessIndex = i;
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
      readyQueue.push(nextProcessIndex);
      continue;
    }
    
    // Get the next process from the ready queue
    const processIndex = readyQueue.shift()!;
    const process = processesCopy[processIndex];
    
    // Record response time if first time on CPU
    if (process.responseTime === -1) {
      process.responseTime = currentTime - process.arrivalTime;
    }
    
    // Calculate how long this process will execute
    // Either the full time quantum or until it completes
    const executeTime = Math.min(timeQuantum, process.remainingTime!);
    
    // Add to timeline
    timeline.push({
      time: currentTime,
      action: `Process ${process.id} starts/resumes execution`
    });
    
    // Add to Gantt chart
    ganttChart.push({
      id: process.id,
      start: currentTime,
      end: currentTime + executeTime,
      color: process.color || '#3498db'
    });
    
    // Update time and remaining time
    currentTime += executeTime;
    process.remainingTime! -= executeTime;
    
    // Check for new arrivals while this process was running
    // and add them to the ready queue
    for (let i = 0; i < processesCopy.length; i++) {
      const p = processesCopy[i];
      if (!completed[i] && p.arrivalTime > currentTime - executeTime && 
          p.arrivalTime <= currentTime && !readyQueue.includes(i) && i !== processIndex) {
        readyQueue.push(i);
      }
    }
    
    // Check if process has completed
    if (process.remainingTime === 0) {
      process.completionTime = currentTime;
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;
      
      timeline.push({
        time: currentTime,
        action: `Process ${process.id} completes execution`
      });
      
      completed[processIndex] = true;
      completedCount++;
    } else {
      // Process still has remaining time, put it back in the ready queue
      timeline.push({
        time: currentTime,
        action: `Process ${process.id} is preempted, remaining: ${process.remainingTime}`
      });
      
      readyQueue.push(processIndex);
    }
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