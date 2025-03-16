import React from 'react';
import { ResultsMap, Process } from '../types';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { generatePDF } from '../lib/pdfutils';

interface AlgorithmComparisonProps {
  results: ResultsMap;
  processes: Process[];
  timeQuantum?: number;
}

const getAlgorithmName = (key: string): string => {
  switch (key) {
    case 'FIFO': return 'First In First Out';
    case 'SJF': return 'Shortest Job First';
    case 'STCF': return 'Shortest Time-to-Completion First';
    case 'RR': return 'Round Robin';
    case 'MLFQ': return 'Multi-Level Feedback Queue';
    default: return key;
  }
};

const AlgorithmComparison: React.FC<AlgorithmComparisonProps> = ({ 
  results,
  processes,
  timeQuantum
}) => {
  if (!results || Object.keys(results).length === 0) {
    return null;
  }
  
  const algorithms = Object.keys(results);
  
  const handleDownloadPDF = () => {
    generatePDF(results, processes, timeQuantum);
  };
  
  const chartData = {
    labels: algorithms.map(getAlgorithmName),
    datasets: [
      {
        label: 'Avg. Turnaround Time',
        data: algorithms.map(algo => results[algo].metrics.avgTurnaroundTime),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
      {
        label: 'Avg. Waiting Time',
        data: algorithms.map(algo => results[algo].metrics.avgWaitingTime),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: 'Avg. Response Time',
        data: algorithms.map(algo => results[algo].metrics.avgResponseTime),
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Algorithm Performance Comparison'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
  };
  
  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Algorithm Comparison</h2>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-indigo-600 text-black rounded-md hover:bg-indigo-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download Comparison PDF
        </button>
      </div>
      
      <div className="mb-8 h-96">
        <Bar data={chartData} options={chartOptions} />
      </div>
      
      <div className="mb-8 overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Algorithm</th>
              <th className="py-2 px-4 border-b">Avg. Turnaround Time</th>
              <th className="py-2 px-4 border-b">Avg. Waiting Time</th>
              <th className="py-2 px-4 border-b">Avg. Response Time</th>
            </tr>
          </thead>
          <tbody>
            {algorithms.map(algo => (
              <tr key={algo}>
                <td className="py-2 px-4 border-b font-medium">{getAlgorithmName(algo)}</td>
                <td className="py-2 px-4 border-b text-center">{results[algo].metrics.avgTurnaroundTime.toFixed(2)}</td>
                <td className="py-2 px-4 border-b text-center">{results[algo].metrics.avgWaitingTime.toFixed(2)}</td>
                <td className="py-2 px-4 border-b text-center">{results[algo].metrics.avgResponseTime.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Gantt Charts</h3>
        {algorithms.map(algo => (
          <div key={algo} className="mb-8">
            <h4 className="font-medium mb-2">{getAlgorithmName(algo)}</h4>
            <div className="overflow-x-auto">
              <div className="relative h-16" style={{ minWidth: '100%', width: `${Math.max(results[algo].ganttChart[results[algo].ganttChart.length - 1].end * 30, 500)}px` }}>
                {/* Time markers */}
                {Array.from({ length: results[algo].ganttChart[results[algo].ganttChart.length - 1].end + 1 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute bottom-0 w-px h-16 bg-gray-300" 
                    style={{ left: `${i * 30}px` }}
                  >
                    <span className="absolute -bottom-6">{i}</span>
                  </div>
                ))}
                
                {/* Process blocks */}
                {results[algo].ganttChart.map((item, index) => (
                  <div 
                    key={index}
                    className="absolute h-10 flex items-center justify-center text-xs font-bold border border-gray-700"
                    style={{ 
                      left: `${item.start * 30}px`, 
                      width: `${(item.end - item.start) * 30}px`,
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
        ))}
      </div>
    </div>
  );
};

export default AlgorithmComparison;