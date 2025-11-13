import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getUserProfile } from "../../api/authApi";
import { updateQuiz, getFacultyQuizById } from "../../api/facultyApi";
import { QuizSuccessPopUp } from "../../components/QuizSuccessPopUp";

export const UpdateQuiz = () => {

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);

  // Convert server datetime to HTML datetime-local format
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date - tzOffset).toISOString().slice(0, 16);
  };

  // "01:30:00" → minutes
  const formatDuration = (durationStr) => {
    if (!durationStr) return "";
    const [h, m] = durationStr.split(":").map(Number);
    return h * 60 + m;
  };

  // Load quiz + user
  useEffect(() => {
    const init = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);

        if (location.state?.quiz) {
          const q = location.state.quiz;

          setQuiz({
            ...q,
            start_time: formatDateTimeLocal(q.start_time),
            end_time: formatDateTimeLocal(q.end_time),
            duration: formatDuration(q.duration)
          });
        } else {
          const fetched = await getFacultyQuizById(id);
          setQuiz({
            ...fetched,
            start_time: formatDateTimeLocal(fetched.start_time),
            end_time: formatDateTimeLocal(fetched.end_time),
            duration: formatDuration(fetched.duration)
          });
        }
      } catch (e) {
        console.log("Error loading page:", e);
      }
    };
    init();
  }, [id, location.state]);

  if (!quiz) return <p className="text-center mt-20">Loading...</p>;

  // Handlers
  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, e) => {
    const updated = [...quiz.questions];
    updated[index][e.target.name] = e.target.value;
    setQuiz({ ...quiz, questions: updated });
  };

  const handleAddQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        { text: "", option1: "", option2: "", option3: "", option4: "", correct_option: "" }
      ]
    });
  };

  const handleDeleteQuestion = (index) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...quiz,
        duration: quiz.duration * 60,
        start_time: new Date(quiz.start_time).toISOString(),
        end_time: new Date(quiz.end_time).toISOString(),
      };

      await updateQuiz(id, payload);

      setShowPopUp(true);
      setTimeout(() => navigate("/faculty"), 2000);
    } catch (err) {
      console.log("Error updating quiz:", err);
    }
  };

  return (
    <motion.div
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Title */}
      <motion.h2
        className="text-4xl font-extrabold mb-8 text-center text-indigo-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        Update Quiz
      </motion.h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="
          bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl 
          p-4 sm:p-6 md:p-8 space-y-8
        "
      >

        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <input
            type="text"
            name="title"
            placeholder="Quiz Title"
            value={quiz.title}
            onChange={handleQuizChange}
            className="p-3 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="text"
            readOnly
            value={user?.user?.username || ""}
            className="p-3 rounded-lg border border-gray-300 bg-gray-100 w-full"
          />

          <input
            type="text"
            readOnly
            value={user?.department || ""}
            className="p-3 rounded-lg border border-gray-300 bg-gray-100 w-full"
          />

          <select
            name="year"
            value={quiz.year}
            onChange={handleQuizChange}
            className="p-3 rounded-lg border border-gray-300 w-full"
          >
            <option value="FE">FE (First Year)</option>
            <option value="SE">SE (Second Year)</option>
            <option value="TE">TE (Third Year)</option>
            <option value="BE">BE (Final Year)</option>
          </select>
        </div>

        {/* Dates + Duration */}
        <div className="flex flex-col md:flex-row gap-6 w-full">
        
          <div className="flex flex-col w-full">
            <label className="text-sm font-semibold mb-1">Start Time</label>
            <input
              type="datetime-local"
              name="start_time"
              value={quiz.start_time}
              onChange={handleQuizChange}
              className="p-3 rounded-lg border border-gray-300 w-full"
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-sm font-semibold mb-1">End Time</label>
            <input
              type="datetime-local"
              name="end_time"
              value={quiz.end_time}
              onChange={handleQuizChange}
              className="p-3 rounded-lg border border-gray-300 w-full"
            />
          </div>

        </div>

        <input
          type="number"
          name="duration"
          placeholder="Duration in minutes"
          value={quiz.duration}
          onChange={handleQuizChange}
          className="p-3 rounded-lg border border-gray-300 w-full"
        />

        <textarea
          name="description"
          placeholder="Quiz Description"
          value={quiz.description}
          onChange={handleQuizChange}
          className="p-3 rounded-lg border border-gray-300 w-full h-28"
        />

        {/* Questions */}
        {quiz.questions.map((q, index) => (
          <motion.div
            key={index}
            className="p-4 sm:p-5 border rounded-xl shadow-md bg-gray-50/70 space-y-4 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-gray-700">
              Question {index + 1}
            </h3>

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
              className="px-4 py-2 bg-red-500 hover:bg-red-600 transition text-white rounded-lg"
            >
              Delete Question
            </button>
          </motion.div>
        ))}

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="px-4 py-2 md:px-6 md:py-3 w-full md:w-auto rounded-xl bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 transition"
          >
            Add Question
          </button>

          <button
            type="submit"
            className="px-4 py-2 md:px-6 md:py-3 w-full md:w-auto rounded-xl bg-green-600 text-white shadow-lg hover:bg-green-700 transition"
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
