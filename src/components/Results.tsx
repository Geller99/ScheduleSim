import React from 'react';
import { AlgorithmResult, Process } from '../types';
import { generatePDF } from '../lib/pdfutils';


interface AlgorithmResultsProps {
  result: AlgorithmResult;
  algorithmName: string;
  processes: Process[];
  timeQuantum?: number;
}

const AlgorithmResults: React.FC<AlgorithmResultsProps> = ({ 
  result, 
  algorithmName,
  processes,
  timeQuantum
}) => {
  if (!result) return null;
  
  const handleDownloadPDF = () => {
    const algorithmKey = algorithmName.split(' ')[0]; 
    const resultsMap = {
      [algorithmKey]: result
    };
    generatePDF(resultsMap, processes, timeQuantum);
  };
  
  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{algorithmName} Results</h2>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-indigo-600 text-black rounded-md hover:bg-indigo-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download PDF
        </button>
      </div>

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
                {item.queue && ` (Q${item.queue})`}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Process Details */}
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