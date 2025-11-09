import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFacultyAnalyticsDetails } from "../../api/facultyApi";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export const QuizAnalyticsDetails = () => {
  const { quizId } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getFacultyAnalyticsDetails(quizId);
      setData(res.students || []);
    };
    fetch();
  }, [quizId]);

  // Prepare Pass/Fail counts for Pie Chart
  const passCount = data.filter((s) => s.passed).length;
  const failCount = data.length - passCount;

  const pieData = [
    { name: "Pass", value: passCount },
    { name: "Fail", value: failCount }
  ];

  const COLORS = ["#4CAF50", "#EF4444"]; // Green & Red

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-indigo-600 mb-6">
        Quiz Result Analysis
      </h1>

      {/* PASS FAIL PIE CHART */}
      <div className="bg-white p-6 rounded-xl shadow mb-6 flex items-center justify-center">
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-700 text-center">
            Pass vs Fail Overview
          </h2>
          <PieChart width={350} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* STUDENTS TABLE */}
      <table className="w-full text-left border-collapse bg-white shadow rounded-xl">
        <thead className="bg-indigo-100 text-gray-700">
          <tr>
            <th className="p-3">Student</th>
            <th className="p-3">Score</th>
            <th className="p-3">Percentage</th>
            <th className="p-3">Passed</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, index) => (
            <tr key={index} className="border-b hover:bg-indigo-50">
              <td className="p-3">{r.student}</td>
              <td className="p-3">{r.score}</td>
              <td className="p-3">{r.percentage}%</td>
              <td className="p-3">
                {r.passed ? (
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
  );
};
