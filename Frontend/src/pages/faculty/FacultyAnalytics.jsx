import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { useNavigate } from "react-router-dom";
import { getFacultyAnalytics } from "../../api/facultyApi";

export const FacultyAnalytics = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getFacultyAnalytics();
      setData(res);
      console.log(res)
    };
    fetchData();
  }, []);

  if (!data) return <div className="p-10 text-center text-xl">Loading analytics...</div>;

  const COLORS = ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Title */}
      <motion.h1 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-indigo-600 mb-6"
      >
        Faculty Analytics Dashboard
      </motion.h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

        <StatCard title="Total Students" value={data.total_students} />
        <StatCard title="Total Quizzes" value={data.total_quizzes} />

      </div>

      {/* Year-Wise Performance Bar Chart */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-xl shadow mb-6"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Year-wise Average Performance</h2>
        <BarChart width={600} height={300} data={data.year_performance}>
          <XAxis dataKey="quiz__year" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avg_percentage" fill="#4F46E5" />
        </BarChart>
      </motion.div>

      {/* Quiz Summary Table */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-xl shadow"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Quiz Performance Summary</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-indigo-100 text-gray-700">
              <th className="p-3">Quiz Name</th>
              <th className="p-3">Attempted</th>
              <th className="p-3">Max Score</th>
              <th className="p-3">Min Score</th>
              <th className="p-3">Avg Score</th>
            </tr>
          </thead>
          <tbody>
            {data.quiz_summary.map((quiz) => (
              <tr 
                key={quiz.quiz__id} 
                onClick={() => navigate(`faculty_analytics_details/${quiz.quiz_id}`)}
                className="hover:bg-indigo-50 cursor-pointer border-b"
              >
                <td className="p-3">{quiz.quiz__title}</td>
                <td className="p-3">{quiz.attempted}</td>
                <td className="p-3">{quiz.max_score}</td>
                <td className="p-3">{quiz.min_score}</td>
                <td className="p-3">{Number(quiz.avg_score).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

    </div>
  );
};

const StatCard = ({ title, value }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-xl shadow text-center border border-indigo-100"
  >
    <h3 className="text-gray-600 text-sm">{title}</h3>
    <p className="text-3xl font-bold text-indigo-600">{value}</p>
  </motion.div>
);
