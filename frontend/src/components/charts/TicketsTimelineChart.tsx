"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TicketsTimelineChartProps {
  data: Array<{
    date: string;
    count: string;
  }>;
}

export default function TicketsTimelineChart({ data }: TicketsTimelineChartProps) {
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    }),
    tickets: parseInt(item.count),
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="tickets" 
            stroke="#3B82F6" 
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

