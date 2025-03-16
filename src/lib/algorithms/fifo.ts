import { Process, AlgorithmResult, GanttItem, TimelineEvent } from '../../types';
import { prepareProcesses } from '../processUtils';

export const runFIFO = (processes: Process[]): AlgorithmResult => {
  const processesCopy = prepareProcesses(processes);
  let currentTime = 0;
  const timeline: TimelineEvent[] = [];
  const ganttChart: GanttItem[] = [];
  
  // Iterate through each process in arrival order
  for (let i = 0; i < processesCopy.length; i++) {
    const process = processesCopy[i];
    
    // If there's a gap between current time and next process arrival,
    // add idle time to the Gantt chart
    if (currentTime < process.arrivalTime) {
      ganttChart.push({
        id: 'Idle',
        start: currentTime,
        end: process.arrivalTime,
        color: '#cccccc'
      });
      currentTime = process.arrivalTime;
    }
    
    // Record response time (when process first gets CPU)
    process.responseTime = currentTime - process.arrivalTime;
    
    // Add execution to timeline
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
    
    currentTime += process.burstTime;
  

    process.completionTime = currentTime;
    process.turnaroundTime = process.completionTime - process.arrivalTime;
    process.waitingTime = process.turnaroundTime - process.burstTime;
    
    timeline.push({
      time: currentTime,
      action: `Process ${process.id} completes execution`
    });
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