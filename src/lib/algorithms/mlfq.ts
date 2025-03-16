// src/lib/algorithms/mlfq.ts
import { Process, AlgorithmResult, GanttItem, TimelineEvent } from '../../types';
import { prepareProcesses } from '../processUtils';

export const runMLFQ = (processes: Process[]): AlgorithmResult => {
  // Make a deep copy of processes to avoid modifying original
  const processesCopy = prepareProcesses(processes);
  let currentTime = 0;
  const timeline: TimelineEvent[] = [];
  const ganttChart: GanttItem[] = [];
  
  // Define multiple queues with different time quantums
  const queues = [
    { quantum: 1, processes: [] as number[] },  // Highest priority queue (0)
    { quantum: 2, processes: [] as number[] },  // Medium priority queue (1)
    { quantum: 4, processes: [] as number[] }   // Lowest priority queue (2)
  ];
  
  // Initialize process priorities
  processesCopy.forEach(process => {
    process.priority = 0; // All processes start in the highest priority queue
    process.timeInQueue = 0; // Track time spent in current queue
  });
  
  // Track completion status
  const completed = new Array(processesCopy.length).fill(false);
  let completedCount = 0;
  
  // Continue until all processes are completed
  while (completedCount < processesCopy.length) {
    // Check for newly arrived processes and add to highest priority queue
    for (let i = 0; i < processesCopy.length; i++) {
      if (!completed[i] && processesCopy[i].arrivalTime <= currentTime) {
        const queue = processesCopy[i].priority || 0;
        if (!queues[queue].processes.includes(i)) {
          queues[queue].processes.push(i);
        }
      }
    }
    
    // Find the highest priority non-empty queue
    let activeQueueIndex = -1;
    for (let i = 0; i < queues.length; i++) {
      if (queues[i].processes.length > 0) {
        activeQueueIndex = i;
        break;
      }
    }
    
    // If all queues are empty, advance time to next process arrival
    if (activeQueueIndex === -1) {
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
      // Add the newly arrived process to the highest priority queue
      queues[0].processes.push(nextProcessIndex);
      continue;
    }
    
    // Get the first process from the highest priority non-empty queue
    const activeQueue = queues[activeQueueIndex];
    const processIndex = activeQueue.processes.shift()!;
    const process = processesCopy[processIndex];
    const timeQuantum = activeQueue.quantum;
    
    // Record response time if first time on CPU
    if (process.responseTime === -1) {
      process.responseTime = currentTime - process.arrivalTime;
    }
    
    // Calculate how long this process will execute
    const executeTime = Math.min(timeQuantum, process.remainingTime!);
    
    // Add to timeline
    timeline.push({
      time: currentTime,
      action: `Process ${process.id} starts/resumes execution (Queue ${activeQueueIndex + 1})`
    });
    
    // Add to Gantt chart
    ganttChart.push({
      id: process.id,
      start: currentTime,
      end: currentTime + executeTime,
      color: process.color || '#3498db',
      queue: activeQueueIndex + 1 // Include queue level for visualization
    });
    
    // Update time and remaining time
    currentTime += executeTime;
    process.remainingTime! -= executeTime;
    process.timeInQueue = (process.timeInQueue || 0) + executeTime;
    
    // Check for new arrivals while this process was running
    // and add them to the highest priority queue
    for (let i = 0; i < processesCopy.length; i++) {
      if (!completed[i] && processesCopy[i].arrivalTime > currentTime - executeTime && 
          processesCopy[i].arrivalTime <= currentTime && 
          !queues[0].processes.includes(i) && i !== processIndex) {
        queues[0].processes.push(i);
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
      // Process used its entire time quantum without completing
      if (executeTime === timeQuantum) {
        // Demote to lower priority queue if not already at lowest
        if (process.priority! < queues.length - 1) {
          process.priority!++;
          process.timeInQueue = 0;
          
          timeline.push({
            time: currentTime,
            action: `Process ${process.id} is demoted to Queue ${process.priority! + 1}`
          });
        }
      }
      
      // Add back to appropriate queue
      queues[process.priority!].processes.push(processIndex);
      
      timeline.push({
        time: currentTime,
        action: `Process ${process.id} is preempted, remaining: ${process.remainingTime}`
      });
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