import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Process } from '../types/scheduler';

interface ResultsTableProps {
  processes: Process[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  processes,
  averageWaitingTime,
  averageTurnaroundTime,
  averageResponseTime,
}) => {
  if (processes.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No results available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Scheduling Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Process Results Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Process ID</TableHead>
                <TableHead className="font-semibold">Arrival Time</TableHead>
                <TableHead className="font-semibold">Burst Time</TableHead>
                <TableHead className="font-semibold">Completion Time</TableHead>
                <TableHead className="font-semibold">Turnaround Time</TableHead>
                <TableHead className="font-semibold">Waiting Time</TableHead>
                <TableHead className="font-semibold">Response Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.map((process, index) => (
                <TableRow 
                  key={process.id}
                  className="transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{process.id}</TableCell>
                  <TableCell>{process.arrivalTime}</TableCell>
                  <TableCell>{process.burstTime}</TableCell>
                  <TableCell>{process.completionTime || 0}</TableCell>
                  <TableCell>{process.turnaroundTime || 0}</TableCell>
                  <TableCell>{process.waitingTime || 0}</TableCell>
                  <TableCell>{process.responseTime || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Average Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-primary rounded-lg p-4 text-white">
            <div className="text-sm opacity-90">Average Waiting Time</div>
            <div className="text-2xl font-bold">{averageWaitingTime.toFixed(2)}</div>
          </div>
          
          <div className="bg-chart-secondary rounded-lg p-4 text-white">
            <div className="text-sm opacity-90">Average Turnaround Time</div>
            <div className="text-2xl font-bold">{averageTurnaroundTime.toFixed(2)}</div>
          </div>
          
          <div className="bg-chart-accent rounded-lg p-4 text-white">
            <div className="text-sm opacity-90">Average Response Time</div>
            <div className="text-2xl font-bold">{averageResponseTime.toFixed(2)}</div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-6 p-4 bg-secondary/50 rounded-lg border">
          <h3 className="font-semibold mb-2">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <strong>Total Processes:</strong> {processes.length}
            </div>
            <div>
              <strong>Total Execution Time:</strong> {Math.max(...processes.map(p => p.completionTime || 0))}
            </div>
            <div>
              <strong>Best Waiting Time:</strong> {Math.min(...processes.map(p => p.waitingTime || 0))}
            </div>
            <div>
              <strong>Worst Waiting Time:</strong> {Math.max(...processes.map(p => p.waitingTime || 0))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsTable;