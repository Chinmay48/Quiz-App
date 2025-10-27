import { useEffect, useState } from "react"
import { getUserProfile } from "../../api/authApi";
import { StudentSidebar } from "../../components/StudentSideBar";
import { Outlet } from "react-router-dom";
export const StudentDashboard=()=>{
    const[user,setUser]=useState("");
    const[loading,setLoading]=useState(true)
     
    useEffect(()=>{
    const fetchData=async()=>{
        try {
           const currentUser= await getUserProfile()
           setUser(currentUser)
        } catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    }
    fetchData();
    },[])
    if(loading) return <p>Loading...</p>
    return(
        <div className="flex h-screen">
     
         <StudentSidebar  username={user.user.username}/>

      
      <div className="flex-1 ml-64 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
    )
}