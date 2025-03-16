import jsPDF from 'jspdf';
import { ResultsMap, Process } from '../types';

export const generatePDF = (results: ResultsMap, processes: Process[], timeQuantum?: number): void => {
  const doc = new jsPDF();
  let yPos = 20;
  
  doc.setFontSize(16);
  doc.text('CPU Scheduling Algorithms Simulation Results', 105, yPos, { align: 'center' });
  yPos += 10;
  
  doc.setFontSize(12);
  doc.text(`Number of Processes: ${processes.length}`, 14, yPos);
  yPos += 7;
  
  if (timeQuantum) {
    doc.text(`Time Quantum (for RR): ${timeQuantum}`, 14, yPos);
    yPos += 7;
  }
  
  doc.setFontSize(14);
  doc.text('Process Information', 14, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.text('Process ID', 14, yPos);
  doc.text('Arrival Time', 44, yPos);
  doc.text('Burst Time', 74, yPos);
  yPos += 7;
  
  processes.forEach(process => {
    doc.text(process.id, 14, yPos);
    doc.text(process.arrivalTime.toString(), 44, yPos);
    doc.text(process.burstTime.toString(), 74, yPos);
    yPos += 7;
    
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
  });
  
  yPos += 10;
  
  Object.entries(results).forEach(([algo, result]) => {
    doc.addPage();
    yPos = 20;
    
    doc.setFontSize(14);
    doc.text(`${getAlgorithmName(algo)} Results`, 14, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.text('Performance Metrics:', 14, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.text(`Average Turnaround Time: ${result.metrics.avgTurnaroundTime.toFixed(2)}`, 20, yPos);
    yPos += 7;
    doc.text(`Average Waiting Time: ${result.metrics.avgWaitingTime.toFixed(2)}`, 20, yPos);
    yPos += 7;
    doc.text(`Average Response Time: ${result.metrics.avgResponseTime.toFixed(2)}`, 20, yPos);
    yPos += 15;
    
    doc.setFontSize(12);
    doc.text('Process Details:', 14, yPos);
    yPos += 10;
    
    doc.setFontSize(9);
    doc.text('Process ID', 14, yPos);
    doc.text('Arrival', 40, yPos);
    doc.text('Burst', 60, yPos);
    doc.text('Completion', 80, yPos);
    doc.text('Turnaround', 110, yPos);
    doc.text('Waiting', 140, yPos);
    doc.text('Response', 170, yPos);
    yPos += 7;
    
    result.processes.forEach(process => {
      doc.text(process.id, 14, yPos);
      doc.text(process.arrivalTime.toString(), 40, yPos);
      doc.text(process.burstTime.toString(), 60, yPos);
      doc.text(process.completionTime?.toString() || '-', 80, yPos);
      doc.text(process.turnaroundTime?.toString() || '-', 110, yPos);
      doc.text(process.waitingTime?.toString() || '-', 140, yPos);
      doc.text(process.responseTime?.toString() || '-', 170, yPos);
      yPos += 7;
      
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
  });
  
  doc.save('cpu-scheduling-results.pdf');
};


const getAlgorithmName = (algo: string): string => {
  switch (algo) {
    case 'FIFO': return 'First In First Out (FIFO)';
    case 'SJF': return 'Shortest Job First (SJF)';
    case 'STCF': return 'Shortest Time-to-Completion First (STCF)';
    case 'RR': return 'Round Robin (RR)';
    case 'MLFQ': return 'Multi-Level Feedback Queue (MLFQ)';
    default: return algo;
  }
};