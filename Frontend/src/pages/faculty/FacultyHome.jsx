import { useEffect, useState } from "react";
import { deleteQuiz, getFacultyQuizzes } from "../../api/facultyApi";
import { QuizCard } from "../../components/QuizCard";
import { motion } from "framer-motion";
import study1 from "../../assets/study1.png";
import study2 from "../../assets/study2.png";
import study3 from "../../assets/study3.png"
import { QuizSuccessPopUp } from "../../components/QuizSuccessPopUp";
import { useNavigate } from "react-router-dom";

export const FacultyHome = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false);
  const navigate = useNavigate();

  const cardImages = [study1, study2,study3];

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizList = await getFacultyQuizzes();
        setQuizzes(quizList);
       
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleDelete = async (quiz) => {
    try {
      await deleteQuiz(quiz.id);
    
      setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
      setShowPopUp(true);
    } catch (error) {
      console.log("Failed to delete quiz", error);
    }
  };

  const handleUpdate = (quiz) => {
    navigate(`/faculty/update/${quiz.id}`, { state: { quiz } });
  };

  const currentTime = new Date();

 const upcomingQuizzes = quizzes.filter(
  (q) => new Date(q.start_time) > currentTime
);

  const onGoingQuizzes = quizzes.filter(
    (q) =>
      new Date(q.start_time) <= currentTime &&
      new Date(q.end_time) > currentTime
  );
  const previousQuizzes = quizzes.filter(
    (q) => new Date(q.end_time) <= currentTime
  );

  if (loading) return <p className="text-center mt-20">Loading quizzes...</p>;

  // Framer Motion variants
  const sectionVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const listVariant = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-12 p-4 md:p-8">
      <motion.section
        variants={sectionVariant}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-bold mb-6 text-green-700">
          Upcoming Quizzes
        </h2>
        {upcomingQuizzes.length === 0 ? (
          <p className="text-gray-500">No upcoming quizzes</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={listVariant}
            initial="hidden"
            animate="visible"
          >
            {upcomingQuizzes.map((quiz, index) => (
              <motion.div key={quiz.id} variants={itemVariant}>
                <QuizCard
                  quiz={quiz}
                  bgImage={cardImages[index % cardImages.length]}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* Ongoing Quizzes */}
      <motion.section
        variants={sectionVariant}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">
          Ongoing Quizzes
        </h2>
        {onGoingQuizzes.length === 0 ? (
          <p className="text-gray-500">No ongoing quizzes</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={listVariant}
            initial="hidden"
            animate="visible"
          >
            {onGoingQuizzes.map((quiz, index) => (
              <motion.div key={quiz.id} variants={itemVariant}>
                <QuizCard
                  quiz={quiz}
                  bgImage={cardImages[index % cardImages.length]}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* Previous Quizzes */}
      <motion.section
        variants={sectionVariant}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          Previous Quizzes
        </h2>
        {previousQuizzes.length === 0 ? (
          <p className="text-gray-500">No previous quizzes</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={listVariant}
            initial="hidden"
            animate="visible"
          >
            {previousQuizzes.map((quiz, index) => (
              <motion.div key={quiz.id} variants={itemVariant}>
                <QuizCard
                  quiz={quiz}
                  bgImage={cardImages[index % cardImages.length]}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
        {showPopUp && (
          <QuizSuccessPopUp
            show={showPopUp}
            setShow={setShowPopUp}
            message1={"Quiz Deleted Successfully"}
            message2={"Updated scheduled will be display soon"}
          />
        )}
      </motion.section>
    </div>
  );
};
