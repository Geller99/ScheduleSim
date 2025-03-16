import React from 'react';
import { AlgorithmType } from '../types';

interface AlgorithmSelectorProps {
  selectedAlgorithm: AlgorithmType;
  setSelectedAlgorithm: (algorithm: AlgorithmType) => void;
  onRunAlgorithm: () => void;
  onRunAllAlgorithms: () => void;  
  onClearResults: () => void;      
  isRunning: boolean;
  hasProcesses: boolean;
  hasResults: boolean;            
}

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedAlgorithm,
  setSelectedAlgorithm,
  onRunAlgorithm,
  onRunAllAlgorithms,
  onClearResults,
  isRunning,
  hasProcesses,
  hasResults
}) => {


  const algorithms = [
    { value: 'FIFO', label: 'First In First Out (FIFO)', description: 'Processes are executed in the order they arrive. Non-preemptive.' },
    { value: 'SJF', label: 'Shortest Job First (SJF)', description: 'Processes with the shortest burst time are executed first. Non-preemptive.' },
    { value: 'STCF', label: 'Shortest Time-to-Completion First (STCF)', description: 'Preemptive version of SJF. Processes with shortest remaining time are prioritized.' },
    { value: 'RR', label: 'Round Robin (RR)', description: 'Each process gets a fixed time slice in a circular manner. Preemptive.' },
    { value: 'MLFQ', label: 'Multi-Level Feedback Queue (MLFQ)', description: 'Uses multiple priority queues with different time quantums. Processes move between queues based on behavior.' }
  ];
  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Algorithm Selection</h2>
      
      <div className="space-y-3">
        {algorithms.map((algorithm) => (
          <div key={algorithm.value} className="mb-3">
            <div className="flex items-center">
              <input
                type="radio"
                id={algorithm.value}
                name="algorithm"
                checked={selectedAlgorithm === algorithm.value}
                onChange={() => setSelectedAlgorithm(algorithm.value as AlgorithmType)}
                disabled={isRunning}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={algorithm.value} className="ml-2 block text-sm text-gray-700">
                {algorithm.label}
              </label>
            </div>
            <p className="mt-1 text-sm text-gray-600 ml-6">
              {algorithm.description}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={onRunAlgorithm}
          disabled={isRunning || !hasProcesses}
          className={`px-4 py-2 rounded-md text-black ${
            !hasProcesses || isRunning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isRunning ? 'Running...' : `Run ${selectedAlgorithm} Algorithm`}
        </button>
        
        <button
          onClick={onRunAllAlgorithms}
          disabled={isRunning || !hasProcesses}
          className={`px-4 py-2 rounded-md text-black ${
            !hasProcesses || isRunning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? 'Running...' : 'Run All Algorithms'}
        </button>
        
        <button
          onClick={onClearResults}
          disabled={!hasResults || isRunning}
          className={`px-4 py-2 rounded-md text-black ${
            !hasResults || isRunning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          Clear Results
        </button>
      </div>
    </div>
  );
};

export default AlgorithmSelector;