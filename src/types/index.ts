export interface Process {
    id: string;           // Unique identifier for each process
    arrivalTime: number;  // When the process arrives in the ready queue
    burstTime: number;    // Total CPU time needed
    
    // Fields calculated during algorithm execution
    remainingTime?: number;     // Time left to complete (for preemptive algorithms)
    completionTime?: number;    // When the process finishes execution
    turnaroundTime?: number;    // completionTime - arrivalTime
    waitingTime?: number;       // turnaroundTime - burstTime
    responseTime?: number;      // Time between arrival and first CPU usage
    
    // Additional fields for specific algorithms
    priority?: number;          // For MLFQ algorithm
    timeInQueue?: number;       // Time spent in current queue (for MLFQ)
    color?: string;             // For visualization
  }

  export interface GanttItem {
    id: string;
    start: number;
    end: number;
    color: string;
    queue?: number; // For MLFQ visualization
  }
  
  // Timeline event for process history
  export interface TimelineEvent {
    time: number;
    action: string;
  }
  
  // Result structure for algorithm output
  export interface AlgorithmResult {
    processes: Process[];        // Processes with calculated metrics
    timeline: TimelineEvent[];   // History of events for animation
    ganttChart: GanttItem[];     // Data for Gantt chart visualization
    metrics: {                   // Summary statistics
      avgTurnaroundTime: number;
      avgWaitingTime: number;
      avgResponseTime: number;
    };
  }
  
  // Algorithm names
  export type AlgorithmType = 'FIFO' | 'SJF' | 'STCF' | 'RR' | 'MLFQ' | 'all';