import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface StockChartProps {
  data: { time: string; price: number }[];
  color?: string;
}

export const StockChart: React.FC<StockChartProps> = ({ data, color = "#10b981" }) => {
  return (
    <div className="h-[300px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.1}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            minTickGap={30}
          />
          <YAxis 
            hide 
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '12px'
            }}
            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
