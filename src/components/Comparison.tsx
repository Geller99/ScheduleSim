// src/components/AlgorithmComparison.tsx

import React from 'react';
import { ResultsMap } from '../types';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

interface AlgorithmComparisonProps {
  results: ResultsMap;
}

// Helper function to get label for algorithm
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

const AlgorithmComparison: React.FC<AlgorithmComparisonProps> = ({ results }) => {
  if (!results || Object.keys(results).length === 0) {
    return null;
  }
  
  const algorithms = Object.keys(results);
  
  // Prepare data for Chart.js
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
      <h2 className="text-xl font-semibold mb-6">Algorithm Comparison</h2>
      
      {/* Performance Metrics Comparison Chart */}
      <div className="mb-8 h-96">
        <Bar data={chartData} options={chartOptions} />
      </div>
      
      {/* Metrics Comparison Table */}
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
      
      {/* Gantt Charts for Each Algorithm */}
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