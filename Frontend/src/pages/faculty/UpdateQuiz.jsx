import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getUserProfile } from "../../api/authApi";
import { updateQuiz, getFacultyQuizById } from "../../api/facultyApi"; // make sure you add getFacultyQuizById
import { QuizSuccessPopUp } from "../../components/QuizSuccessPopUp";

export const UpdateQuiz = () => {
  const { id } = useParams(); // quiz id from URL
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [quiz, setQuiz] = useState(null);

  const formatDateTimeLocal = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const tzOffset = date.getTimezoneOffset() * 60000; // fix UTC offset
  const localISOTime = new Date(date - tzOffset).toISOString().slice(0, 16);
  return localISOTime;
};

// Convert "01:00:00" → minutes (e.g., 60)
const formatDuration = (durationStr) => {
  if (!durationStr) return "";
  const [hours, minutes, seconds] = durationStr.split(":").map(Number);
  return hours * 60 + minutes; // return minutes
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);

        if (location.state?.quiz) {
           const q = location.state.quiz;
  setQuiz({
    ...q,
    start_time:formatDateTimeLocal(q.start_time),
    end_time: formatDateTimeLocal(q.end_time),
    duration: formatDuration(q.duration),
  }); // from FacultyHome
        } else {
          const quizData = await getFacultyQuizById(id);
          setQuiz({
            ...quizData,
            start_time: formatDateTimeLocal(quizData.start_time),
             end_time: formatDateTimeLocal(quizData.end_time),
        duration: formatDuration(quizData.duration),
          });
          console.log(quizData)
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, [id, location.state]);

  if (!quiz) {
    return <p className="text-center mt-20">Loading quiz...</p>;
  }

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][e.target.name] = e.target.value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          text: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          correct_option: "",
        },
      ],
    });
  };

  const handleDeleteQuestion = (index) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...quiz, duration: quiz.duration * 60,end_time: new Date(quiz.end_time).toISOString(), };
      await updateQuiz(id, payload);
      setShowPopUp(true);
      setTimeout(() => navigate("/faculty"), 2000);
    } catch (err) {
      console.error("Error updating quiz:", err);
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-4xl font-extrabold mb-8 text-center text-indigo-700">
        Update Quiz
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl p-6 space-y-8"
      >
        {/* Title, faculty, department, year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="title"
            placeholder="Quiz Title"
            value={quiz.title}
            onChange={handleQuizChange}
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition"
          />
          <input
            type="text"
            name="faculty"
            readOnly
            value={user ? user.user.username : ""}
            className="p-3 rounded-lg border border-gray-300 bg-gray-100"
          />
          <input
            type="text"
            name="department"
            readOnly
            value={user ? user.department : ""}
            className="p-3 rounded-lg border border-gray-300 bg-gray-100"
          />
          <select
            name="year"
            value={quiz.year}
            onChange={handleQuizChange}
            className="p-3 rounded-xl border border-gray-300 bg-white"
          >
            <option value="FE">FE (First Year)</option>
            <option value="SE">SE (Second Year)</option>
            <option value="TE">TE (Third Year)</option>
            <option value="BE">BE (Final Year)</option>
          </select>
        </div>

        {/* Time + Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="datetime-local"
             name="start_time" 
            value={quiz.start_time}
            onChange={handleQuizChange}
            className="p-3 rounded-lg border border-gray-300"
          />
          <input
            type="datetime-local"
            name="end_time"
            value={quiz.end_time}
            onChange={handleQuizChange}
            className="p-3 rounded-lg border border-gray-300"
          />
          <input
            type="number"
            name="duration"
            placeholder="Duration in minutes"
            value={quiz.duration}
            onChange={handleQuizChange}
            className="p-3 rounded-lg border border-gray-300"
          />
        </div>

        {/* Description */}
        <textarea
          name="description"
          placeholder="Quiz Description"
          value={quiz.description}
          onChange={handleQuizChange}
          className="p-3 rounded-lg border border-gray-300 w-full h-28"
        />

        {/* Questions */}
        {quiz.questions.map((q, index) => (
          <div key={index} className="p-4 border rounded-xl bg-gray-50 space-y-4">
            <h3 className="text-lg font-semibold">Question {index + 1}</h3>
            <input
              type="text"
              name="text"
              value={q.text}
              placeholder="Enter question"
              onChange={(e) => handleQuestionChange(index, e)}
              className="p-3 rounded-lg border border-gray-300 w-full"
            />
            {["option1", "option2", "option3", "option4"].map((opt, i) => (
              <input
                key={i}
                type="text"
                name={opt}
                value={q[opt]}
                placeholder={`Option ${i + 1}`}
                onChange={(e) => handleQuestionChange(index, e)}
                className="p-3 rounded-lg border border-gray-300 w-full"
              />
            ))}
            <input
              type="text"
              name="correct_option"
              value={q.correct_option}
              placeholder="Correct Option (1-4)"
              onChange={(e) => handleQuestionChange(index, e)}
              className="p-3 rounded-lg border border-gray-300 w-full"
            />
            <button
              type="button"
              onClick={() => handleDeleteQuestion(index)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Delete Question
            </button>
          </div>
        ))}

        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="px-6 py-3 rounded-xl bg-indigo-500 text-white"
          >
            Add Question
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-green-600 text-white"
          >
            Update Quiz
          </button>
        </div>
      </form>

      {showPopUp && (
        <QuizSuccessPopUp
          show={showPopUp}
          setShow={setShowPopUp}
          message1="Quiz Updated Successfully"
          message2="Changes have been saved"
        />
      )}
    </motion.div>
  );
};
