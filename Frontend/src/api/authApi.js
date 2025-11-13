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

export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};


export const changePassword=async(data)=>{
    const response=await axios.post("http://127.0.0.1:8000/api/accounts/change_password/",data,{
         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
    })
    return response.data;
}

export const registerUser = async (data) => {
  const res = await axios.post("http://127.0.0.1:8000/api/accounts/register/", data);
  return res.data;
};