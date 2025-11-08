import axios from "axios";
const API_URL="http://127.0.0.1:8000/api/quiz"
const RESULT_URL="http://127.0.0.1:8000/api/result"

export const getStudentQuiz=async()=>{
     const token=localStorage.getItem("access")
    const response=await axios.get(`${API_URL}/quizzes/`,{
        headers:{Authorization:`Bearer ${token}`}
    })
    return response.data
}

export const getStudentQuizById=async(quizId)=>{
    const token=localStorage.getItem("access")
    try {
        const response=await axios.get(`${API_URL}/quizzes/${quizId}/`,{
         headers:{Authorization:`Bearer ${token}`}
        
    }) 
    return response.data
    } catch (error) {
        console.log("Failed to fetch quiz id:",error)
    }
   
}

export const createSubmission=async(quizId)=>{
    const token=localStorage.getItem("access")
    try {
        const response=await axios.post(`${API_URL}/submission/`,{quiz:quizId},{
         headers:{Authorization:`Bearer ${token}`}
        
    })
    return response.data
    } catch (error) {
        console.log(error)
    }

}

export const submitAnswer=async(submissionId,questionId,selectedOption)=>{
    const token=localStorage.getItem("access")
    try {
        const response=await axios.post(`${API_URL}/answers/`,{
            submission:submissionId,question:questionId,selected_option:selectedOption
        },{
         headers:{Authorization:`Bearer ${token}`}
        
    })
    return response.data
    } catch (error) {
        console.log(error)
    }
}


export const fetchSubmissionStatus=async(quizId)=>{
     const token=localStorage.getItem('access')
    const res=await axios.get(`${API_URL}/${quizId}/submission-status/`,{
        headers: { Authorization: `Bearer ${token}` }
    })
    return res.data.attempted
}

export const getQuizResult=async(quizId)=>{
    const token=localStorage.getItem('access')
    const res=await axios.get(`${RESULT_URL}/quiz/${quizId}/`,{
        headers:{Authorization: `Bearer ${token}`}
    })
    return res.data
}

