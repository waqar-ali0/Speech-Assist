import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceDot,
  Label
} from 'recharts';

interface PerDataPoint {
  date: string;
  per: number;
}

interface ProblemDataPoint {
  name: string;
  value: number;
  fill: string;
}

interface PerTrendChartProps {
  data: PerDataPoint[];
}

interface ProblemSoundsChartProps {
  data: ProblemDataPoint[];
}

export const PerTrendChart: React.FC<PerTrendChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
        No practice data yet
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#6B7280' }} 
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6B7280' }} 
            axisLine={false}
            tickLine={false}
            domain={[0, 1]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Line
            type="monotone"
            dataKey="per"
            stroke="#10B981" 
            strokeWidth={2}
            dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ProblemSoundsChart: React.FC<ProblemSoundsChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
        No problem sounds detected yet
      </div>
    );
  }

  return (
    <div className="h-64 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={1}
            dataKey="value"
            stroke="white"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};