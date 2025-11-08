import { useEffect, useState } from "react"
import { getStudentQuiz } from "../../api/studentApi";
import { motion } from "framer-motion";
import study1 from "../../assets/study1.png";
import study2 from "../../assets/study2.png";
import study3 from "../../assets/study3.png";

import { StudentQuizCard } from "../../components/StudentQuizCard";
import { Navigate, useNavigate } from "react-router-dom";
export const StudentHome=()=>{
    
    const navigate=useNavigate()
    const[quizes,setQuizes]=useState([]);
    const[loading,setLoading]=useState(true)

    const handleAttempt=(quiz)=>{
        try {
            navigate(`/student/attempt/${quiz.id}`)
        } catch (error) {
            
        }
    }
    
    useEffect(()=>{
       const fetchQuiz=async ()=>{
        try {
            const quizList= await getStudentQuiz()
            setQuizes(quizList)
            console.log(quizList)
        } catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false)
        }
       }
       fetchQuiz();
    },[])
   
    const cardImages = [study1, study2, study3];
   const currentTime = new Date();

const upcomingQuiz = quizes.filter(
  (q) => new Date(q.start_time) > currentTime
);

const ongoingQuiz = quizes.filter(
  (q) => new Date(q.start_time) <= currentTime && new Date(q.end_time) >= currentTime
);

const previousQuiz = quizes.filter(
  (q) => new Date(q.end_time) < currentTime
);
    if (loading) return <p>Loading...</p>
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
    return(
        <div className="space-y-12 p-4 md:p-8">
      <motion.section
        variants={sectionVariant}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-bold mb-6 text-green-700">
          Upcoming Quizzes
        </h2>
        {upcomingQuiz.length === 0 ? (
          <p className="text-gray-500">No upcoming quizzes</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={listVariant}
            initial="hidden"
            animate="visible"
          >
            {upcomingQuiz.map((quiz, index) => (
              <motion.div key={quiz.id} variants={itemVariant}>
                <StudentQuizCard
                  quiz={quiz}
                  bgImage={cardImages[index % cardImages.length]}
                  
                 
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
        {ongoingQuiz.length === 0 ? (
          <p className="text-gray-500">No ongoing quizzes</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={listVariant}
            initial="hidden"
            animate="visible"
          >
            {ongoingQuiz.map((quiz, index) => (
              <motion.div key={quiz.id} variants={itemVariant}>
                <StudentQuizCard
                  quiz={quiz}
                  bgImage={cardImages[index % cardImages.length]}
                  onAttempt={handleAttempt}
                  
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
        {previousQuiz.length === 0 ? (
          <p className="text-gray-500">No previous quizzes</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={listVariant}
            initial="hidden"
            animate="visible"
          >
            {previousQuiz.map((quiz, index) => (
              <motion.div key={quiz.id} variants={itemVariant}>
                <StudentQuizCard
                  quiz={quiz}
                  bgImage={cardImages[index % cardImages.length]}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
       
      </motion.section>
    </div>
    )
}