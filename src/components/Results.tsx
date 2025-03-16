// src/components/AlgorithmResults.tsx

import React from 'react';
import { AlgorithmResult } from '../types';

interface AlgorithmResultsProps {
  result: AlgorithmResult;
  algorithmName: string;
}

const AlgorithmResults: React.FC<AlgorithmResultsProps> = ({ 
  result, 
  algorithmName 
}) => {
  if (!result) return null;
  
  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">{algorithmName} Results</h2>
      
      {/* Performance Metrics */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">Avg. Turnaround Time</div>
            <div className="text-xl font-bold">{result.metrics.avgTurnaroundTime.toFixed(2)}</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600">Avg. Waiting Time</div>
            <div className="text-xl font-bold">{result.metrics.avgWaitingTime.toFixed(2)}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600">Avg. Response Time</div>
            <div className="text-xl font-bold">{result.metrics.avgResponseTime.toFixed(2)}</div>
          </div>
        </div>
      </div>
      
      {/* Gantt Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Gantt Chart</h3>
        <div className="overflow-x-auto">
          <div className="relative h-16" style={{ minWidth: '100%', width: `${Math.max(result.ganttChart[result.ganttChart.length - 1].end * 50, 500)}px` }}>
            {/* Time markers */}
            {Array.from({ length: result.ganttChart[result.ganttChart.length - 1].end + 1 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute bottom-0 w-px h-16 bg-gray-300" 
                style={{ left: `${i * 50}px` }}
              >
                <span className="absolute -bottom-6">{i}</span>
              </div>
            ))}
            
            {/* Process blocks */}
            {result.ganttChart.map((item, index) => (
              <div 
                key={index}
                className="absolute h-10 flex items-center justify-center text-xs font-bold border border-gray-700"
                style={{ 
                  left: `${item.start * 50}px`, 
                  width: `${(item.end - item.start) * 50}px`,
                  backgroundColor: item.color,
                  color: item.id === 'Idle' ? 'black' : 'white',
                  top: '0px'
                }}
              >
                {item.id}
                {item.queue && ` (Q${item.queue})`} {/* For MLFQ */}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Process Results Table */}
      <div>
        <h3 className="text-lg font-medium mb-2">Process Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Process ID</th>
                <th className="py-2 px-4 border-b">Arrival Time</th>
                <th className="py-2 px-4 border-b">Burst Time</th>
                <th className="py-2 px-4 border-b">Completion Time</th>
                <th className="py-2 px-4 border-b">Turnaround Time</th>
                <th className="py-2 px-4 border-b">Waiting Time</th>
                <th className="py-2 px-4 border-b">Response Time</th>
              </tr>
            </thead>
            <tbody>
              {result.processes.map((process) => (
                <tr key={process.id}>
                  <td className="py-2 px-4 border-b text-center">{process.id}</td>
                  <td className="py-2 px-4 border-b text-center">{process.arrivalTime}</td>
                  <td className="py-2 px-4 border-b text-center">{process.burstTime}</td>
                  <td className="py-2 px-4 border-b text-center">{process.completionTime}</td>
                  <td className="py-2 px-4 border-b text-center">{process.turnaroundTime}</td>
                  <td className="py-2 px-4 border-b text-center">{process.waitingTime}</td>
                  <td className="py-2 px-4 border-b text-center">{process.responseTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmResults;