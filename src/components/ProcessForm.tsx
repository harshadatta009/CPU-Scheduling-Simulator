import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Process, SchedulingAlgorithm } from '../types/scheduler';

interface ProcessFormProps {
  onProcessesChange: (processes: Process[]) => void;
  algorithm: SchedulingAlgorithm;
}

const ProcessForm: React.FC<ProcessFormProps> = ({ onProcessesChange, algorithm }) => {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', arrivalTime: 0, burstTime: 8, priority: 3 },
    { id: 'P2', arrivalTime: 1, burstTime: 4, priority: 1 },
    { id: 'P3', arrivalTime: 2, burstTime: 9, priority: 4 },
    { id: 'P4', arrivalTime: 3, burstTime: 5, priority: 2 },
  ]);

  const needsPriority = algorithm.includes('PRIORITY');

  React.useEffect(() => {
    onProcessesChange(processes);
  }, [processes, onProcessesChange]);

  const addProcess = () => {
    const newId = `P${processes.length + 1}`;
    setProcesses([...processes, { 
      id: newId, 
      arrivalTime: 0, 
      burstTime: 1, 
      priority: needsPriority ? 1 : undefined 
    }]);
  };

  const removeProcess = (id: string) => {
    if (processes.length > 1) {
      setProcesses(processes.filter(p => p.id !== id));
    }
  };

  const updateProcess = (id: string, field: keyof Process, value: string | number) => {
    setProcesses(processes.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Process Configuration</span>
          <Button onClick={addProcess} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Process
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {processes.map((process, index) => (
            <div 
              key={process.id} 
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4 rounded-lg border bg-secondary/50 transition-all duration-300 hover:bg-secondary/70"
            >
              <div className="space-y-2">
                <Label htmlFor={`id-${process.id}`} className="text-sm font-medium">
                  Process ID
                </Label>
                <Input
                  id={`id-${process.id}`}
                  value={process.id}
                  onChange={(e) => updateProcess(process.id, 'id', e.target.value)}
                  className="h-9"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`arrival-${process.id}`} className="text-sm font-medium">
                  Arrival Time
                </Label>
                <Input
                  id={`arrival-${process.id}`}
                  type="number"
                  min="0"
                  value={process.arrivalTime}
                  onChange={(e) => updateProcess(process.id, 'arrivalTime', parseInt(e.target.value) || 0)}
                  className="h-9"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`burst-${process.id}`} className="text-sm font-medium">
                  Burst Time
                </Label>
                <Input
                  id={`burst-${process.id}`}
                  type="number"
                  min="1"
                  value={process.burstTime}
                  onChange={(e) => updateProcess(process.id, 'burstTime', parseInt(e.target.value) || 1)}
                  className="h-9"
                />
              </div>
              
              {needsPriority && (
                <div className="space-y-2">
                  <Label htmlFor={`priority-${process.id}`} className="text-sm font-medium">
                    Priority
                  </Label>
                  <Input
                    id={`priority-${process.id}`}
                    type="number"
                    min="1"
                    value={process.priority || 1}
                    onChange={(e) => updateProcess(process.id, 'priority', parseInt(e.target.value) || 1)}
                    className="h-9"
                  />
                </div>
              )}
              
              <div className="flex items-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeProcess(process.id)}
                  disabled={processes.length <= 1}
                  className="h-9 px-3"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {needsPriority && (
          <div className="mt-4 p-3 bg-chart-accent/10 rounded-lg border border-chart-accent/20">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Higher priority values indicate higher priority for execution.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProcessForm;