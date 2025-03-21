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
    queue?: number; 
  }
  

  export interface TimelineEvent {
    time: number;
    action: string;
  }

  export interface AlgorithmResult {
    processes: Process[];       
    timeline: TimelineEvent[];  
    ganttChart: GanttItem[];    
    metrics: {                   
      avgTurnaroundTime: number;
      avgWaitingTime: number;
      avgResponseTime: number;
    };
  }

  export interface ResultsMap {
    [key: string]: AlgorithmResult;
  }
  

  export type AlgorithmType = 'FIFO' | 'SJF' | 'STCF' | 'RR' | 'MLFQ' | 'all';