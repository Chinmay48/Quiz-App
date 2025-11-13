import { useEffect, useState } from "react";
import { getUserProfile } from "../../api/authApi";
import StudentSidebar from "../../components/StudentSideBar";
import { Outlet } from "react-router-dom";

import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";

export const StudentDashboard = () => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getUserProfile();
        setUser(currentUser);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lock scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <StudentSidebar
        username={user.user.username}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* MOBILE TOP NAVBAR */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          
          {/* Hamburger */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg bg-indigo-500 text-white shadow"
          >
            <GiHamburgerMenu size={20} />
          </button>

          {/* App Title + Profile */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-800">Quiz App</h1>

            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
              <CgProfile />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT – adds desktop margin */}
      <main className="flex-1 p-4 md:p-6 md:ml-64 transition-all duration-300">
        
        {/* Space under mobile navbar */}
        <div className="mt-16 md:mt-0">
          <Outlet />
        </div>

      </main>
    </div>
  );
};

export default StudentDashboard;
