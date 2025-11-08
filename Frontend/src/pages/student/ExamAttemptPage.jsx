import { useState, useEffect } from "react";
import { getStudentQuizById } from "../../api/studentApi";
import { useNavigate, useParams } from "react-router-dom";
import { createSubmission,submitAnswer } from "../../api/studentApi";
import axios from "axios";
export const ExamAttemptPage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answer, setAnswer] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timeLeft,setTimeLeft]=useState(0)
  const navigate=useNavigate();
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await getStudentQuizById(quizId);
        console.log("quiz", response);
        setQuiz(response);
        const[h,m,s]=response.duration.split(":").map(Number)
        setTimeLeft(h*3600+m*60+s)
        console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);
   
     useEffect(()=>{
      if(timeLeft<=0){
        handleSubmit();
        return;
      }
      const timer=setInterval(()=>{
        
        setTimeLeft((prev)=>prev-1)
      },1000)
      return ()=> clearInterval(timer)
     },[timeLeft])  
     
     const formatTime=(seconds)=>{
      const h=Math.floor(seconds/3600).toString().padStart(2,"0")
      const m=Math.floor((seconds%3600)/60).toString().padStart(2,"0")
      const s=Math.floor(seconds%60).toString().padStart(2,"0")
      return `${h}:${m}:${s}`
     }
  const handleOptionChange = (option) => {
    setAnswer({
      ...answer,
      [currentQIndex]: option,
    });
  };

  const handleMarkedForReview = () => {
    setMarkedForReview({
      ...markedForReview,
      [currentQIndex]: !markedForReview[currentQIndex],
    });
  };
   
  const handleErase=()=>{
    const newAnswer={...answer}
    delete newAnswer[currentQIndex]
    setAnswer(newAnswer)
  }

  const handleNext=()=>{
    if(currentQIndex<quiz.questions.length-1) setCurrentQIndex(currentQIndex+1)
  }

  const handleSideBarClick=(index)=>{
        setCurrentQIndex(index)
  }

  const handleSubmit=async()=>{
    try {
      const submission=await createSubmission(quizId)
      console.log(submission)
      const questionId=quiz.questions.map(q=>q.id);
      for(let i=0;i<questionId.length ;i++){
        const qid=questionId[i]
        const selected=answer[i]
        if(selected){
          await submitAnswer(submission.id,qid,selected)
        }
      }

      const token=localStorage.getItem("access");
      await axios.post(`http://127.0.0.1:8000/api/quiz/submission/${submission.id}/finish/`,{},{headers: { Authorization: `Bearer ${token}` } })
      

      navigate(`/student/quiz/result/${quizId}`)
    } catch (error) {
      console.log(error)
    }
  }
  

  if (loading) return <p> Loading... </p>;
  const question = quiz.questions[currentQIndex];
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="w-full h-15 text-2xl text-white bg-indigo-600 flex items-center justify-between">
          <div className="mx-2.5">{quiz.title}</div>
          <div className="mx-2.5">Time Left: {formatTime(timeLeft)}</div>
          <div>
            <button className="bg-green-600 rounded-lg m-5 text-lg py-1 px-2 cursor-pointer" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>

        <div className="bg-slate-200 w-full h-lvh flex flex-row gap-2 ">
          <div className="flex flex-col gap-3">
            <div className="bg-white text-2xl mx-6  w-265 h-15 flex mt-3 justify-center items-center border-0 rounded-lg">
              Question: {currentQIndex + 1}
            </div>
            <div className="bg-white text-lg mx-6  w-265 h-55 p-1.5 overflow-auto border-0 rounded-lg">
              {question.text}
            </div>

            {[
              question.option1,
              question.option2,
              question.option3,
              question.option4,
            ].map((opt, idx) => (
              <div
                className={` mx-6  w-265 h-13 p-1.5 flex flex-row justify-self-start items-center  gap-1 border-0 rounded-lg  ${
                  answer[currentQIndex] === `${idx+1}`
                    ? "bg-indigo-200"
                    : "bg-white"
                } `}
              >
                <label
                  key={idx}
                  className={`flex items-center p-2 cursor-pointer`}
                >
                  <input
                    type="radio"
                    name={`q${currentQIndex}`}
                    checked={answer[currentQIndex] === idx + 1}
                    onChange={() => handleOptionChange(idx+1)}
                    className="mr-2"
                  />{" "}
                  {opt}
                </label>
              </div>
            ))}
            <div className="flex flex-row justify-center items-center mx-6 gap-2">
              <button
                onClick={handleMarkedForReview}
                className={`px-3 py-1 rounded  ${
                  markedForReview[currentQIndex]
                    ? "bg-yellow-500"
                    : "bg-blue-300"
                }`}
              >
                {markedForReview[currentQIndex]
                  ? "Unmark Review"
                  : "Mark for Review"}
              </button>
              <button onClick={handleErase} className=" rounded bg-red-400 text-white px-3 py-1">
              Erase
              </button>
               <button onClick={handleNext} className=" rounded bg-green-500 text-white px-3 py-1">
              Save & Next
              </button>

            </div>
          </div>
          <div className="w-90 bg-white h-137 mt-3 rounded-lg overflow-scroll flex flex-col gap-2 items-center justify-start">
            <div className="text-lg font-semibold ">
              Questions
            </div>
            <div className="w-full bg-indigo-200 h-0.5"></div>
            <div className="grid grid-cols-4 gap-4">
              {quiz.questions.map((q,index)=>(
                <button key={index} onClick={()=>handleSideBarClick(index)} className={`p-2 rounded-full w-16 cursor-pointer h-15 text-2xl  border  ${index===currentQIndex? "bg-indigo-500 text-white"
                    : markedForReview[index]
                    ? "bg-yellow-300"
                    : answer[index]
                    ? "bg-green-300"
                    : "bg-white"}`}>
                {index+1}

                </button>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};
