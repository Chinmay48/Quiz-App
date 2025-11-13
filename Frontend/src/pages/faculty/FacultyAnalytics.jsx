import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { getFacultyAnalytics } from "../../api/facultyApi";

export const FacultyAnalytics = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getFacultyAnalytics();
      setData(res);
    };
    fetchData();
  }, []);

  if (!data)
    return (
      <div className="p-10 text-center text-xl">Loading analytics...</div>
    );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold text-indigo-600 mb-6"
      >
        Faculty Analytics Dashboard
      </motion.h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Students" value={data.total_students} />
        <StatCard title="Total Quizzes" value={data.total_quizzes} />
      </div>

      {/* Responsive Bar Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-4 md:p-6 rounded-xl shadow mb-6"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Year-wise Average Performance
        </h2>

        <div className="w-full h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.year_performance}>
              <XAxis dataKey="quiz__year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg_percentage" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Responsive Scrollable Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-4 md:p-6 rounded-xl shadow"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Quiz Performance Summary
        </h2>

        {/* Scroll Wrapper for table (prevents full page scroll) */}
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-left border-collapse">
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
                  onClick={() =>
                    navigate(`faculty_analytics_details/${quiz.quiz_id}`)
                  }
                  className="hover:bg-indigo-50 cursor-pointer border-b"
                >
                  <td className="p-3">{quiz.quiz__title}</td>
                  <td className="p-3">{quiz.attempted}</td>
                  <td className="p-3">{quiz.max_score}</td>
                  <td className="p-3">{quiz.min_score}</td>
                  <td className="p-3">
                    {Number(quiz.avg_score).toFixed(2)}
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

const StatCard = ({ title, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-4 md:p-6 rounded-xl shadow text-center border border-indigo-100"
  >
    <h3 className="text-gray-600 text-sm">{title}</h3>
    <p className="text-2xl md:text-3xl font-bold text-indigo-600">{value}</p>
  </motion.div>
);
