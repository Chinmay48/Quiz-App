import axios from "axios";
const API_BASE_URL='http://127.0.0.1:8000/api';

const axiosInstance=axios.create({
    baseURL:API_BASE_URL,
    headers:{
        "Content-Type":"application/json"
    },
})

axiosInstance.interceptors.request.use((config)=>{
    const token=localStorage.getItem("access")
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }
    return config
})

export default axiosInstance