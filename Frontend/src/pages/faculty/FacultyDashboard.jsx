import { FacultySidebar } from "../../components/FacultySideBar";
import { useEffect, useState } from "react";
import { getUserProfile } from "../../api/authApi";
import { Outlet } from "react-router-dom";

export const FacultyDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getUserProfile();
        setUser(currentUser);
        
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex h-screen">
     
      <FacultySidebar username={user.user.username} />

      
      <div className="flex-1 ml-64 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
