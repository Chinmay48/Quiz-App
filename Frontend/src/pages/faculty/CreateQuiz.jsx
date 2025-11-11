import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUserProfile } from "../../api/authApi";
import { createQuiz } from "../../api/facultyApi";
import { QuizSuccessPopUp } from "../../components/QuizSuccessPopUp";
import { useNavigate } from "react-router-dom";
import { GeminiQuizModal } from "../../components/GeminiQuizModel";

export const CreateQuiz = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [aiModal, setAiModal] = useState(false);

  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    department: "",
    faculty: "",
    year: "",
    end_time: "",
    start_time: "",
    duration: "",
    questions: [
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserProfile();
        console.log(userData);
        setUser(userData);
      } catch (error) {
        console.log("fail");
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][e.target.name] = e.target.value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const applyAIQuestions = (generatedQuestions) => {
    setQuiz({
      ...quiz,
      questions: generatedQuestions,
    });
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
    const updatedQuestions = quiz.questions.filter((_, i) => i != index);
    setQuiz({
      ...quiz,
      questions: updatedQuestions,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      quiz.department = user.department;
      const payload = { ...quiz, duration: quiz.duration * 60 };
      const response = await createQuiz(payload);
      console.log("Quiz created:", response);
      setShowPopUp(true);
      setTimeout(() => {
        navigate("/faculty");
      }, 2000);
    } catch (error) {
      console.log(
        "Error creating quiz:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-4xl font-extrabold mb-8 text-center text-indigo-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        Create Quiz
      </motion.h2>
      <motion.button
        onClick={() => setAiModal(true)}
        whileHover={{ scale: 1.05 }}
        className="mb-4 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl transition"
      >
        Generate Quiz with AI
      </motion.button>

      <form
        onSubmit={handleSubmit}
        className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl p-6 space-y-8"
      >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="text"
            name="title"
            placeholder="Quiz Title"
            value={quiz.title}
            onChange={handleQuizChange}
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
            required
          />
          <input
            type="text"
            name="faculty"
            placeholder="Faculty Name"
            value={user ? user.user.username : ""}
            readOnly
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
            required
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            readOnly
            value={user ? user.department : ""}
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
            required
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.select
              id="year"
              name="year"
              value={quiz.year}
              onChange={handleQuizChange}
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
              className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full bg-white shadow-sm hover:shadow-md cursor-pointer"
              required
            >
              <option value="">-- Choose Year --</option>
              <option value="FE">FE (First Year)</option>
              <option value="SE">SE (Second Year)</option>
              <option value="TE">TE (Third Year)</option>
              <option value="BE">BE (Final Year)</option>
            </motion.select>
          </motion.div>
          <div className="space-y-4 flex flex-row gap-50">
            {/* Start Time Field */}
            <div className="flex flex-col ">
              <label
                htmlFor="start_time"
                className="text-sm font-semibold text-gray-700 mb-1"
              >
                Start Date & Time
              </label>
              <input
                id="start_time"
                type="datetime-local"
                name="start_time"
                value={quiz.start_time ? quiz.start_time : ""}
                onChange={handleQuizChange}
                placeholder="Select start date and time"
                className="p-3 rounded-lg border border-gray-300 focus:ring-2  focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
                required
              />
            </div>

            {/* End Time Field */}
            <div className="flex flex-col">
              <label
                htmlFor="end_time"
                className="text-sm font-semibold text-gray-700 mb-1"
              >
                End Date & Time
              </label>
              <input
                id="end_time"
                type="datetime-local"
                name="end_time"
                value={quiz.end_time ? quiz.end_time : ""}
                onChange={handleQuizChange}
                placeholder="Select end date and time"
                className="p-3 rounded-lg border  border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
                required
              />
            </div>
          </div>
        </motion.div>
        <input
          type="number"
          name="duration"
          placeholder="Duration (in minutes)"
          value={quiz.duration}
          onChange={handleQuizChange}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
          required
        />
        <textarea
          name="description"
          placeholder="Quiz Description"
          value={quiz.description}
          onChange={handleQuizChange}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full h-28"
          required
        />

        {quiz.questions.map((question, index) => (
          <motion.div
            key={index}
            className="p-5 border rounded-xl shadow-md bg-gray-50/70 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <h3 className="text-lg font-semibold text-gray-700">
              Question {index + 1}
            </h3>
            <input
              type="text"
              name="text"
              placeholder={`Enter Question ${index + 1}`}
              value={question.text}
              onChange={(e) => handleQuestionChange(index, e)}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
              required
            />
            {["option1", "option2", "option3", "option4"].map((opt, i) => (
              <input
                key={i}
                type="text"
                name={opt}
                placeholder={`Option ${i + 1}`}
                value={question[opt]}
                onChange={(e) => handleQuestionChange(index, e)}
                className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
                required
              />
            ))}
            <input
              type="text"
              name="correct_option"
              placeholder="Correct Option (1-4)"
              value={question.correct_option}
              onChange={(e) => handleQuestionChange(index, e)}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition w-full"
              required
            />
            <motion.button
              type="button"
              onClick={() => handleDeleteQuestion(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-3 px-4 py-2 rounded-lg bg-red-500 text-white font-medium shadow hover:bg-red-600 transition"
            >
              Delete Question
            </motion.button>
          </motion.div>
        ))}

        <div className="flex justify-between gap-4">
          <motion.button
            type="button"
            onClick={handleAddQuestion}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition"
          >
            Add Question
          </motion.button>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
          >
            Create Quiz
          </motion.button>
        </div>
      </form>

      {showPopUp && (
        <QuizSuccessPopUp
          show={showPopUp}
          setShow={setShowPopUp}
          message1={"Quiz Create Successfully"}
          message2={"Quiz will be added to scheduled"}
        />
      )}
      <GeminiQuizModal
  show={aiModal}
  onClose={() => setAiModal(false)}
  onApply={applyAIQuestions}
/>

    </motion.div>
  );
};
