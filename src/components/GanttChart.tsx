import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GanttChartItem } from '../types/scheduler';

interface GanttChartProps {
  ganttChart: GanttChartItem[];
  totalTime: number;
}

const GanttChart: React.FC<GanttChartProps> = ({ ganttChart, totalTime }) => {
  if (ganttChart.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Gantt Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No execution data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxWidth = 800;
  const timeScale = maxWidth / totalTime;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gantt Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Process execution bars */}
          <div className="relative overflow-x-auto">
            <div 
              className="flex items-center h-16 border border-border rounded-lg bg-secondary/20 relative"
              style={{ minWidth: `${maxWidth}px` }}
            >
              {ganttChart.map((item, index) => {
                const width = (item.endTime - item.startTime) * timeScale;
                const left = item.startTime * timeScale;
                
                return (
                  <div
                    key={index}
                    className="absolute h-12 flex items-center justify-center text-white font-medium text-sm border-r border-white/20 transition-all duration-300 hover:scale-105 hover:z-10 cursor-pointer group"
                    style={{
                      left: `${left}px`,
                      width: `${width}px`,
                      backgroundColor: item.color,
                      borderRadius: index === 0 ? '6px 0 0 6px' : index === ganttChart.length - 1 ? '0 6px 6px 0' : '0',
                    }}
                    title={`${item.processId}: ${item.startTime} - ${item.endTime}`}
                  >
                    <span className="truncate px-1">
                      {width > 30 ? item.processId : ''}
                    </span>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background border border-border rounded px-2 py-1 text-xs text-foreground whitespace-nowrap z-20">
                      {item.processId}: {item.startTime}-{item.endTime}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time labels */}
          <div 
            className="relative"
            style={{ minWidth: `${maxWidth}px` }}
          >
            <div className="flex relative">
              {Array.from({ length: totalTime + 1 }, (_, i) => (
                <div
                  key={i}
                  className="absolute text-xs text-muted-foreground transform -translate-x-1/2"
                  style={{ left: `${i * timeScale}px` }}
                >
                  {i}
                </div>
              ))}
            </div>
          </div>

          {/* Process legend */}
          <div className="flex flex-wrap gap-3 mt-6">
            {Array.from(new Set(ganttChart.map(item => item.processId))).map((processId, index) => {
              const color = ganttChart.find(item => item.processId === processId)?.color;
              return (
                <div key={processId} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border border-white/20"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-medium">{processId}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GanttChart;