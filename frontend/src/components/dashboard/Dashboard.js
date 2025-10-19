import React from 'react';
import { motion } from 'framer-motion';
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
} from 'recharts';

const DashboardCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <motion.div
      className="card"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        </div>
        <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
          <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
      {trend && (
        <div className={`mt-4 text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
        </div>
      )}
    </motion.div>
  );
};

const TaskProgressChart = ({ data }) => {
  return (
    <div className="card h-96">
      <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-4">
        Task Progress Over Time
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#94a3b8"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const TaskDistributionChart = ({ data }) => {
  const COLORS = ['#0ea5e9', '#f59e0b', '#ef4444'];

  return (
    <div className="card h-96">
      <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-4">
        Task Distribution
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const Dashboard = () => {
  // Sample data - replace with real data from API
  const progressData = [
    { date: 'Mon', completed: 5, total: 8 },
    { date: 'Tue', completed: 7, total: 10 },
    { date: 'Wed', completed: 6, total: 9 },
    { date: 'Thu', completed: 9, total: 12 },
    { date: 'Fri', completed: 8, total: 10 },
  ];

  const distributionData = [
    { name: 'Completed', value: 15 },
    { name: 'In Progress', value: 8 },
    { name: 'Pending', value: 5 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Tasks"
          value="28"
          icon={() => <span className="text-2xl">📋</span>}
          trend={12}
        />
        <DashboardCard
          title="Completed"
          value="15"
          icon={() => <span className="text-2xl">✅</span>}
          trend={8}
        />
        <DashboardCard
          title="In Progress"
          value="8"
          icon={() => <span className="text-2xl">⏳</span>}
          trend={-3}
        />
        <DashboardCard
          title="Due Soon"
          value="5"
          icon={() => <span className="text-2xl">⚠️</span>}
          trend={2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskProgressChart data={progressData} />
        <TaskDistributionChart data={distributionData} />
      </div>
    </div>
  );
};

export default Dashboard;