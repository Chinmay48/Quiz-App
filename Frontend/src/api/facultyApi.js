import axios  from "axios";

const API_URL="http://127.0.0.1:8000/api/quiz"

export const getFacultyQuizzes=async ()=>{
    const token=localStorage.getItem("access")
    const response=await axios.get(`${API_URL}/quizzes/`,{
        headers:{Authorization:`Bearer ${token}`}
    })
    return response.data

}

export const getQuizQuestions=async(quizId)=>{
    const token=localStorage.getItem("access")
    const response=await axios.get(`${API_URL}/question`,{
        headers:{Authorization:`Bearer ${token}`}
    })
    return response.data
}

export const getQuizSubmission=async(quizId)=>{
    const token=localStorage.getItem("access")
    const response=await axios.get(`${API_URL}/submission`,{
        headers:{Authorization:`Bearer ${token}`}
    })
    return response.data
}

export const createQuiz=async (quizData)=>{
    const token=localStorage.getItem("access")
    const response=await axios.post(`${API_URL}/quizzes/`,quizData,{
        headers:{
           Authorization: `Bearer ${token}`,
           "Content-Type":"application/json"
        }
    })
    return response.data
}

export const deleteQuiz=async(quizId)=>{
    const token=localStorage.getItem("access")
    console.log(quizId)
    const response=await axios.delete(`${API_URL}/quizzes/${quizId}/delete/`,{
        headers:{Authorization:`Bearer ${token}`}
    })
   return response.data
}

export const updateQuiz=async(quizId,data)=>{
    const token=localStorage.getItem("access")
    const response=await axios.put(`${API_URL}/quizzes/${quizId}/update/`,data,{
        headers:{Authorization:`Bearer ${token}`}
    })
    return response.data
}


export const getFacultyQuizById=async(quizId)=>{
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

export const getFacultyAnalytics=async()=>{
    const token=localStorage.getItem("access")
    try {
         const response=await axios.get(`http://127.0.0.1:8000/api/result/faculty-analytics/`,{
         headers:{Authorization:`Bearer ${token}`}
        
    }) 
    return response.data
    } catch (error) {
        console.log("Failed to fetch analytics:",error)
    }
}

export const getFacultyAnalyticsDetails=async(quizId)=>{
    const token=localStorage.getItem("access")
    try {
       const response=await axios.get(`http://127.0.0.1:8000/api/result/quiz-detail-analytics/${quizId}`,{
         headers:{Authorization:`Bearer ${token}`}
        
    })
    return response.data
    } catch (error) {
        console.log("Failed to fetch detail quiz analytics:",error)
    }
}