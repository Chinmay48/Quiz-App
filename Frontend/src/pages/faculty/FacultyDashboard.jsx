import { useEffect, useState } from "react";
import { getUserProfile } from "../../api/authApi";
import { Outlet } from "react-router-dom";
import FacultySidebar from "../../components/FacultySideBar"; // default export version below
import { CgProfile } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi";

export const FacultyDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // lock scroll when sidebar open on mobile
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar component (renders desktop and mobile drawer when isOpen true) */}
      <FacultySidebar
        username={user.user.username}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Topbar only visible on mobile */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg bg-indigo-500 text-white shadow"
            aria-label="Open menu"
          >
            <GiHamburgerMenu size={20} />
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-800">Quiz App</h1>
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
              <CgProfile />
            </div>
          </div>
        </div>
      </header>

      {/* Main content — md:ml-64 ensures margin only on desktop */}
      <main className="flex-1 p-4 md:p-6 md:ml-64 transition-all duration-300">
        {/* give top spacing on mobile so topbar doesn't overlap */}
        <div className="md:mt-0 mt-16">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default FacultyDashboard;
