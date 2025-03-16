import { Process } from '../types';

/**
 * Generates a random color for process visualization
 */
export const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * Generates a set of random processes
 * @param count Number of processes to generate
 * @param maxArrivalTime Maximum arrival time (default: 10)
 * @param maxBurstTime Maximum burst time (default: 10)
 * @returns Array of randomly generated processes, sorted by arrival time
 */

export const generateProcesses = (
  count: number,
  maxArrivalTime = 10,
  maxBurstTime = 10
): Process[] => {
  const processes: Process[] = [];
  
  for (let i = 0; i < count; i++) {
    processes.push({
      id: `P${i + 1}`,
      arrivalTime: Math.floor(Math.random() * maxArrivalTime),
      burstTime: Math.floor(Math.random() * (maxBurstTime - 1)) + 1, // Ensure burst time is at least 1
      color: getRandomColor()
    });
  }
  
  // Sort by arrival time to ensure proper simulation
  return processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
};

/**
 * Creates a deep copy of processes and initializes simulation fields
 * @param processes Original processes
 * @returns Deep copy with initialized fields for simulation
 */
export const prepareProcesses = (processes: Process[]): Process[] => {
  return processes.map(process => ({
    ...process,
    remainingTime: process.burstTime,
    completionTime: 0,
    turnaroundTime: 0,
    waitingTime: 0,
    responseTime: -1 // -1 indicates process hasn't started yet
  }));
};