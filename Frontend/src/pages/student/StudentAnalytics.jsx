import { useEffect, useState } from "react";
import { getStudentAnalytics } from "../../api/studentApi";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer
} from "recharts";

export const StudentAnalyticsPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await getStudentAnalytics();
      setData(res);
    };
    fetchAnalytics();
  }, []);

  if (!data) return <div className="text-center p-10 text-lg">Loading...</div>;

  const pieData = [
    { name: "Pass", value: data.pass_count },
    { name: "Fail", value: data.fail_count }
  ];

  const COLORS = ["#10B981", "#EF4444"]; // green & red

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen overflow-x-hidden">

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold text-indigo-600 mb-6"
      >
        My Performance Dashboard
      </motion.h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
        <StatCard label="Total Quizzes Attempted" value={data.total_attempted} />
        <StatCard
          label="Average Percentage"
          value={`${data.avg_percentage.toFixed(1)}%`}
        />
        <StatCard
          label="Pass Rate"
          value={`${(
            (data.pass_count / data.total_attempted) * 100 || 0
          ).toFixed(1)}%`}
        />
      </div>

      {/* Performance Trend Line Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-4 md:p-6 rounded-xl shadow mb-8"
      >
        <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
          Performance Trend Over Time
        </h2>

        {/* RESPONSIVE CHART */}
        <div className="w-full h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.performance_trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quiz__title" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="#4F46E5"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Pie Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-4 md:p-6 rounded-xl shadow mb-8"
      >
        <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
          Pass vs Fail Distribution
        </h2>

        <div className="w-full flex justify-center">
          {/* RESPONSIVE PIE CHART */}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius="80%"
                label
                cx="50%"
                cy="50%"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Quiz History Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-4 md:p-6 rounded-xl shadow"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          My Quiz Records
        </h2>

        {/* Scrollable wrapper for small screens */}
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-indigo-100 text-gray-700">
              <tr>
                <th className="p-3">Quiz</th>
                <th className="p-3">Score</th>
                <th className="p-3">Percentage</th>
                <th className="p-3">Result</th>
              </tr>
            </thead>

            <tbody>
              {data.quiz_history.map((q, i) => (
                <tr key={i} className="border-b hover:bg-indigo-50">
                  <td className="p-3">{q.quiz}</td>
                  <td className="p-3">{q.score}</td>
                  <td className="p-3">{q.percentage}%</td>
                  <td className="p-3">
                    {q.passed ? (
                      <span className="text-green-600 font-semibold">PASS</span>
                    ) : (
                      <span className="text-red-600 font-semibold">FAIL</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-4 md:p-6 rounded-xl shadow text-center border border-indigo-100"
  >
    <p className="text-gray-500 text-sm">{label}</p>
    <h3 className="text-2xl md:text-3xl font-bold text-indigo-600">{value}</h3>
  </motion.div>
);
