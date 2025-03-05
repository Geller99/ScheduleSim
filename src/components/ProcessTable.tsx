// src/components/ProcessTable.tsx

import React, { useState } from 'react';
import { Process } from '../types';

interface ProcessTableProps {
  processes: Process[];
}

type SortField = 'id' | 'arrivalTime' | 'burstTime';
type SortOrder = 'asc' | 'desc';

const ProcessTable: React.FC<ProcessTableProps> = ({ processes }) => {
  const [sortField, setSortField] = useState<SortField>('arrivalTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  if (!processes || processes.length === 0) {
    return <div>No processes to display</div>;
  }
  
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  // Create a sorted copy of the processes array
  const sortedProcesses = [...processes].sort((a, b) => {
    let compareResult = 0;
    
    // Sort based on the selected field
    if (sortField === 'id') {
      // Extract numeric part of ID for proper numeric sorting
      const aId = parseInt(a.id.replace(/\D/g, ''));
      const bId = parseInt(b.id.replace(/\D/g, ''));
      compareResult = aId - bId;
    } else if (sortField === 'arrivalTime') {
      compareResult = a.arrivalTime - b.arrivalTime;
    } else if (sortField === 'burstTime') {
      compareResult = a.burstTime - b.burstTime;
    }
    
    // Apply sort order
    return sortOrder === 'asc' ? compareResult : -compareResult;
  });
  
  // Helper function to render sort indicators
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Process Table</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th 
                className="py-2 px-4 border-b cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('id')}
              >
                Process ID {renderSortIndicator('id')}
              </th>
              <th 
                className="py-2 px-4 border-b cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('arrivalTime')}
              >
                Arrival Time {renderSortIndicator('arrivalTime')}
              </th>
              <th 
                className="py-2 px-4 border-b cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('burstTime')}
              >
                Burst Time {renderSortIndicator('burstTime')}
              </th>
              <th className="py-2 px-4 border-b">
                Color
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProcesses.map((process) => (
              <tr key={process.id}>
                <td className="py-2 px-4 border-b text-center">{process.id}</td>
                <td className="py-2 px-4 border-b text-center">{process.arrivalTime}</td>
                <td className="py-2 px-4 border-b text-center">{process.burstTime}</td>
                <td className="py-2 px-4 border-b">
                  <div 
                    className="w-6 h-6 mx-auto rounded-full"
                    style={{ backgroundColor: process.color || '#000' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcessTable;