import { useState } from 'react';
import Controls from './components/Controls';
import ProcessTable from './components/ProcessTable';
import { Process } from './types';

const ScheduleSim = ()  => {
  const [numProcesses, setNumProcesses] = useState<number>(5);
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  
  // State for generated processes
  const [processes, setProcesses] = useState<Process[]>([]);
  
  return (
    <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-center mb-8">
      CPU Scheduling Simulator
    </h1>
    <Controls 
      numProcesses={numProcesses}
      setNumProcesses={setNumProcesses}
      timeQuantum={timeQuantum}
      setTimeQuantum={setTimeQuantum}
      setProcesses={setProcesses}
    />
  
    {processes.length > 0 && (
      <ProcessTable processes={processes} />
    )}
  </div>
  )
}
export default ScheduleSim;
