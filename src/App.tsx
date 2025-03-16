import { useState } from 'react';
import Controls from './components/Controls';
import ProcessTable from './components/ProcessTable';
import AlgorithmSelector from './components/Selector';
import AlgorithmResults from './components/Results';
import { Process, AlgorithmResult, AlgorithmType, ResultsMap } from './types';
import { runFIFO } from './lib/algorithms/fifo';
import { runSJF } from './lib/algorithms/sjf';
import { runSTCF } from './lib/algorithms/stcf';
import { runRR } from './lib/algorithms/rr';

const ScheduleSim = () => {
  const [numProcesses, setNumProcesses] = useState<number>(5);
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('FIFO');
  const [results, setResults] = useState<ResultsMap>({});


  const handleRunAlgorithm = () => {
    console.log("Run algorithm button clicked");
    console.log("Current processes:", processes);
    console.log("Is running:", isRunning);
    
    if (!processes.length || isRunning) {
      console.log("Cannot run algorithm:", !processes.length ? "No processes" : "Already running");
      return;
    }
    
    setIsRunning(true);
    
    setTimeout(() => {
      let result: AlgorithmResult;
      
      try {
        console.log("Executing algorithm:", selectedAlgorithm);
        switch (selectedAlgorithm) {
          case 'FIFO':
            result = runFIFO(processes);
            break;
          case 'SJF':
            result = runSJF(processes);
            break;
          case 'STCF':
            result = runSTCF(processes);
            break;
          case 'RR':
            result = runRR(processes, timeQuantum);
            break;
          default:
            result = runFIFO(processes);
        }
        
        setResults(prevResults => {
          const newResults = {
            ...prevResults,
            [selectedAlgorithm]: result
          };
          console.log("Setting new results:", newResults);
          return newResults;
        });
      } catch (error) {
        console.error("Error running algorithm:", error);
      } finally {
        console.log("Setting isRunning to false");
        setIsRunning(false);
      }
    }, 100);
  };

  const getAlgorithmName = (type: AlgorithmType): string => {
    switch (type) {
      case 'FIFO': return 'First In First Out (FIFO)';
      case 'SJF': return 'Shortest Job First (SJF)';
      case 'STCF': return 'Shortest Time-to-Completion First (STCF)';
      case 'RR': return 'Round Robin (RR)';
      case 'MLFQ': return 'Multi-Level Feedback Queue (MLFQ)';
      default: return type;
    }
  };
  
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
    
      <ProcessTable processes={processes} />
      
      <AlgorithmSelector 
        selectedAlgorithm={selectedAlgorithm}
        setSelectedAlgorithm={setSelectedAlgorithm}
        onRunAlgorithm={handleRunAlgorithm}
        isRunning={isRunning}
        hasProcesses={processes.length > 0}
      />
      
      {results[selectedAlgorithm] && (
        <div>
          <AlgorithmResults 
            result={results[selectedAlgorithm]}
            algorithmName={getAlgorithmName(selectedAlgorithm)}
          />
        </div>
      )}
      
      {/* Debug display */}
      {/* <div className="mt-4 p-2 border border-gray-300 bg-gray-100 rounded">
        <p><strong>Debug Info:</strong></p>
        <p>Selected Algorithm: {selectedAlgorithm}</p>
        <p>Is Running: {isRunning ? 'Yes' : 'No'}</p>
        <p>Process Count: {processes.length}</p>
        <p>Has Results: {results[selectedAlgorithm] ? 'Yes' : 'No'}</p>
      </div> */}
    </div>
  );
};

export default ScheduleSim;