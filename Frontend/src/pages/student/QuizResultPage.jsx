import { useParams } from "react-router-dom";
import { getQuizResult } from "../../api/studentApi";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
export const QuizResultPage = () => {
  const { quizId } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getQuizResult(quizId); 
        console.log("Fetched data:", data);       
        setResult(data);
      } catch (error) {
        console.error("Error fetching quiz result:", error);
      }
    };
    fetchResult();
  }, [quizId]);

  // Optional: log whenever result updates
  useEffect(() => {
    if (result) console.log("Updated result state:", result);
  }, [result]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-indigo-100"
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center text-indigo-600 mb-6"
        >
          Quiz Result
        </motion.h2>

        {result ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 text-gray-700"
          >
            <div className="bg-indigo-50 p-3 rounded-lg shadow-sm">
              <p><span className="font-semibold text-indigo-700">Quiz:</span> {result.quiz_title}</p>
            </div>

            <div className="bg-indigo-50 p-3 rounded-lg shadow-sm">
              <p><span className="font-semibold text-indigo-700">Student:</span> {result.student_name}</p>
            </div>

            <div className="bg-indigo-50 p-3 rounded-lg shadow-sm flex justify-between">
              <p><span className="font-semibold text-indigo-700">Score:</span></p>
              <p>{result.score}/{result.total_questions}</p>
            </div>

            <div className="bg-indigo-50 p-3 rounded-lg shadow-sm flex justify-between">
              <p><span className="font-semibold text-indigo-700">Percentage:</span></p>
              <p>{result.percentage}%</p>
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`mt-6 text-center font-bold text-lg py-3 rounded-xl shadow-md ${
                result.passed
                  ? "bg-indigo-600 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {result.passed ? "Passed" : "Failed"}
            </motion.div>
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-gray-500"
          >
            Loading...
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};
