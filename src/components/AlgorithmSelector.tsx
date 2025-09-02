import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SchedulingAlgorithm } from '../types/scheduler';

interface AlgorithmSelectorProps {
  algorithm: SchedulingAlgorithm;
  onAlgorithmChange: (algorithm: SchedulingAlgorithm) => void;
  timeQuantum: number;
  onTimeQuantumChange: (quantum: number) => void;
}

const algorithmOptions = [
  { value: 'FCFS', label: 'First-Come, First-Served (FCFS)' },
  { value: 'SJF_NON_PREEMPTIVE', label: 'Shortest Job First (Non-Preemptive)' },
  { value: 'SJF_PREEMPTIVE', label: 'Shortest Remaining Time First (Preemptive SJF)' },
  { value: 'PRIORITY_NON_PREEMPTIVE', label: 'Priority Scheduling (Non-Preemptive)' },
  { value: 'PRIORITY_PREEMPTIVE', label: 'Priority Scheduling (Preemptive)' },
  { value: 'ROUND_ROBIN', label: 'Round Robin' },
];

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  algorithm,
  onAlgorithmChange,
  timeQuantum,
  onTimeQuantumChange,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Algorithm Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="algorithm-select">Scheduling Algorithm</Label>
          <Select value={algorithm} onValueChange={onAlgorithmChange}>
            <SelectTrigger id="algorithm-select" className="w-full">
              <SelectValue placeholder="Select an algorithm" />
            </SelectTrigger>
            <SelectContent>
              {algorithmOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {algorithm === 'ROUND_ROBIN' && (
          <div className="space-y-2">
            <Label htmlFor="time-quantum">Time Quantum</Label>
            <Input
              id="time-quantum"
              type="number"
              min="1"
              value={timeQuantum}
              onChange={(e) => onTimeQuantumChange(parseInt(e.target.value) || 1)}
              className="w-full"
              placeholder="Enter time quantum"
            />
          </div>
        )}
        
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground">
            <strong>Algorithm Description:</strong>{' '}
            {algorithm === 'FCFS' && 'Processes are executed in the order they arrive.'}
            {algorithm === 'SJF_NON_PREEMPTIVE' && 'Shortest job is selected next, but current job runs to completion.'}
            {algorithm === 'SJF_PREEMPTIVE' && 'Shortest remaining time is always selected, allowing preemption.'}
            {algorithm === 'PRIORITY_NON_PREEMPTIVE' && 'Highest priority job is selected next, but current job runs to completion.'}
            {algorithm === 'PRIORITY_PREEMPTIVE' && 'Highest priority job is always selected, allowing preemption.'}
            {algorithm === 'ROUND_ROBIN' && 'Each process gets a fixed time slice in round-robin fashion.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlgorithmSelector;