// src/components/Controls.tsx

import React from 'react';
import { Process } from '../types';
import { generateProcesses } from '../lib/processUtils';

interface ControlsProps {
  numProcesses: number;
  setNumProcesses: (num: number) => void;
  timeQuantum: number;
  setTimeQuantum: (quantum: number) => void;
  setProcesses: (processes: Process[]) => void;
}

const Controls: React.FC<ControlsProps> = ({
  numProcesses,
  setNumProcesses,
  timeQuantum,
  setTimeQuantum,
  setProcesses
}) => {
  const handleNumProcessesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setNumProcesses(isNaN(value) ? 1 : Math.max(1, Math.min(20, value)));
  };
  
  const handleTimeQuantumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setTimeQuantum(isNaN(value) ? 1 : Math.max(1, value));
  };
  
  const handleGenerateProcesses = () => {
    const processes = generateProcesses(numProcesses);
    setProcesses(processes);
  };
  
  const handleClearProcesses = () => {
    setProcesses([]);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Simulation Controls</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Processes
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={numProcesses}
            onChange={handleNumProcessesChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Quantum (for RR)
          </label>
          <input
            type="number"
            min="1"
            value={timeQuantum}
            onChange={handleTimeQuantumChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      
      <div className="mt-4 flex space-x-4">
        <button
          onClick={handleGenerateProcesses}
          className="px-4 py-2 bg-blue-500 text-back rounded-md hover:bg-blue-600"
        >
          Generate Processes
        </button>
        
        <button
          onClick={handleClearProcesses}
          className="px-4 py-2 bg-red-500 text-black rounded-md hover:bg-red-600"
        >
          Clear Processes
        </button>
      </div>
    </div>
  );
};

export default Controls;