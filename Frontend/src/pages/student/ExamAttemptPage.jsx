import { useState, useEffect } from "react";
import { getStudentQuizById, createSubmission, submitAnswer } from "../../api/studentApi";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

export const ExamAttemptPage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answer, setAnswer] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();
  const BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await getStudentQuizById(quizId);
        setQuiz(response);

        const [h, m, s] = response.duration.split(":").map(Number);
        setTimeLeft(h * 3600 + m * 60 + s);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleOptionChange = (option) => {
    setAnswer({ ...answer, [currentQIndex]: option });
  };

  const handleMarkedForReview = () => {
    setMarkedForReview({
      ...markedForReview,
      [currentQIndex]: !markedForReview[currentQIndex],
    });
  };

  const handleErase = () => {
    const newAns = { ...answer };
    delete newAns[currentQIndex];
    setAnswer(newAns);
  };

  const handleNext = () => {
    if (currentQIndex < quiz.questions.length - 1)
      setCurrentQIndex(currentQIndex + 1);
  };

  const handleSideBarClick = (index) => {
    setCurrentQIndex(index);
  };

  const handleSubmit = async () => {
    try {
      const submission = await createSubmission(quizId);
      const questionIds = quiz.questions.map((q) => q.id);

      for (let i = 0; i < questionIds.length; i++) {
        if (answer[i]) {
          await submitAnswer(submission.id, questionIds[i], answer[i]);
        }
      }

      const token = localStorage.getItem("access");

      await axios.post(
        `${BASE}/quiz/submission/${submission.id}/finish/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/student/quiz/result/${quizId}`);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;

  const question = quiz.questions[currentQIndex];

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">

      {/* Top Navigation */}
      <div className="w-full bg-indigo-600 text-white px-4 py-3 flex justify-between items-center shadow-md">
        <h2 className="text-lg font-semibold">{quiz.title}</h2>

        <div className="text-lg font-bold bg-white text-indigo-700 px-3 py-1 rounded-md shadow">
          ⏳ {formatTime(timeLeft)}
        </div>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 transition text-white font-semibold rounded-md shadow"
        >
          Submit
        </button>
      </div>

      {/* Main Two Column Layout */}
      <div className="flex flex-col md:flex-row gap-4 px-4 py-4">

        {/* Left Section - Question */}
        <div className="flex-1 bg-white shadow rounded-xl p-4">

          {/* Question Number */}
          <h3 className="text-xl font-semibold mb-2">
            Question {currentQIndex + 1} / {quiz.questions.length}
          </h3>

          {/* Question Text */}
          <p className="text-gray-800 text-lg mb-4 border p-3 rounded-md bg-gray-50 shadow-inner">
            {question.text}
          </p>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {[question.option1, question.option2, question.option3, question.option4].map(
              (opt, idx) => (
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  key={idx}
                  className={`border p-3 rounded-lg cursor-pointer transition shadow-sm ${
                    answer[currentQIndex] === idx + 1
                      ? "bg-indigo-200 border-indigo-500"
                      : "bg-white"
                  }`}
                  onClick={() => handleOptionChange(idx + 1)}
                >
                  <span className="mr-2 font-semibold">{String.fromCharCode(65 + idx)})</span>
                  {opt}
                </motion.div>
              )
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleMarkedForReview}
              className={`px-4 py-2 rounded-md font-semibold shadow ${
                markedForReview[currentQIndex]
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-300"
              }`}
            >
              {markedForReview[currentQIndex] ? "Unmark" : "Mark Review"}
            </button>

            <button
              onClick={handleErase}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 transition text-white rounded-md shadow"
            >
              Erase
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 transition text-white rounded-md shadow"
            >
              Save & Next
            </button>
          </div>
        </div>

        {/* Right Section - Question Palette */}
        <div className="md:w-80 bg-white shadow rounded-xl p-4 h-fit">
          <h3 className="text-lg font-semibold text-center mb-2">Question Palette</h3>

          <div className="grid grid-cols-5 md:grid-cols-4 gap-3 mt-3">
            {quiz.questions.map((q, index) => {
              const isCurrent = index === currentQIndex;
              const isAnswered = answer[index];
              const isReview = markedForReview[index];

              return (
                <button
                  key={index}
                  onClick={() => handleSideBarClick(index)}
                  className={`w-12 h-12 rounded-full text-sm font-bold shadow transition
                    ${
                      isCurrent
                        ? "bg-indigo-600 text-white"
                        : isReview
                        ? "bg-yellow-400"
                        : isAnswered
                        ? "bg-green-400"
                        : "bg-gray-200"
                    }
                  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {/* Color Legend */}
          <div className="mt-5 text-sm text-gray-700">
            <p className="flex items-center gap-2"><span className="w-4 h-4 bg-indigo-600 rounded-full"></span> Current</p>
            <p className="flex items-center gap-2"><span className="w-4 h-4 bg-green-400 rounded-full"></span> Answered</p>
            <p className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-400 rounded-full"></span> Marked for Review</p>
            <p className="flex items-center gap-2"><span className="w-4 h-4 bg-gray-300 rounded-full"></span> Not Visited</p>
          </div>
        </div>
      </div>
    </div>
  );
};
