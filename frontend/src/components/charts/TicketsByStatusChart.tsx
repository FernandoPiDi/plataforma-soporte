"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface TicketsByStatusChartProps {
  data: Array<{
    estado: string;
    count: string;
  }>;
}

const COLORS = {
  abierta: "#3B82F6", // blue
  "en progreso": "#F59E0B", // yellow
  cerrada: "#10B981", // green
};

const STATUS_LABELS = {
  abierta: "Abierta",
  "en progreso": "En Progreso",
  cerrada: "Cerrada",
};

export default function TicketsByStatusChart({ data }: TicketsByStatusChartProps) {
  const chartData = data.map((item) => ({
    name: STATUS_LABELS[item.estado as keyof typeof STATUS_LABELS] || item.estado,
    value: parseInt(item.count),
    estado: item.estado,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.estado as keyof typeof COLORS] || "#8884d8"} 
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

