import axios from "axios"
import axiosInstance from "./axiosConfig"

export const loginUser=async(username,password)=>{
    const response=await axios.post("http://127.0.0.1:8000/api/token/",{
        username:String(username),
        password:String(password),
      
    })
    return response.data;
      
}

export const getUserProfile=async()=>{
    const response=await axiosInstance.get("/accounts/me")
    return response.data
}