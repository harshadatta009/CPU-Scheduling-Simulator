import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';
import { Process, SchedulingAlgorithm, SchedulingResult } from '../types/scheduler';
import { runSchedulingAlgorithm } from '../utils/schedulingAlgorithms';
import AlgorithmSelector from './AlgorithmSelector';
import ProcessForm from './ProcessForm';
import GanttChart from './GanttChart';
import ResultsTable from './ResultsTable';

const CPUScheduler: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<SchedulingAlgorithm>('FCFS');
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [result, setResult] = useState<SchedulingResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleProcessesChange = useCallback((newProcesses: Process[]) => {
    setProcesses(newProcesses);
  }, []);

  const runSimulation = async () => {
    if (processes.length === 0) return;

    setIsSimulating(true);
    
    // Add a small delay for animation effect
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const simulationResult = runSchedulingAlgorithm(algorithm, processes, timeQuantum);
      setResult(simulationResult);
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const resetSimulation = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              CPU Scheduling Simulator
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Visualize and analyze different CPU scheduling algorithms with interactive simulations
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Configuration Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <AlgorithmSelector
            algorithm={algorithm}
            onAlgorithmChange={setAlgorithm}
            timeQuantum={timeQuantum}
            onTimeQuantumChange={setTimeQuantum}
          />
          
          {/* Control Panel */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Simulation Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={runSimulation}
                  disabled={processes.length === 0 || isSimulating}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  <Play className="h-4 w-4" />
                  {isSimulating ? 'Running Simulation...' : 'Run Simulation'}
                </Button>
                
                <Button 
                  onClick={resetSimulation}
                  variant="outline"
                  disabled={!result}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground text-center">
                {processes.length === 0 ? 
                  'Add processes below to start simulation' : 
                  `Ready to simulate ${processes.length} process${processes.length !== 1 ? 'es' : ''}`
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Process Configuration */}
        <ProcessForm 
          onProcessesChange={handleProcessesChange}
          algorithm={algorithm}
        />

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-fade-in">
            <GanttChart 
              ganttChart={result.ganttChart}
              totalTime={result.totalTime}
            />
            
            <ResultsTable
              processes={result.processes}
              averageWaitingTime={result.averageWaitingTime}
              averageTurnaroundTime={result.averageTurnaroundTime}
              averageResponseTime={result.averageResponseTime}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CPUScheduler;