"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TicketsByClientChartProps {
  data: Array<{
    client_name: string;
    count: string;
  }>;
}

export default function TicketsByClientChart({ data }: TicketsByClientChartProps) {
  const chartData = data.map((item) => ({
    name: item.client_name,
    tickets: parseInt(item.count),
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="tickets" fill="#8B5CF6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

