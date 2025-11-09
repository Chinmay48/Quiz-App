import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { logoutUser } from "../api/authApi";// adjust path if needed
import { IoCreateSharp } from "react-icons/io5";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { TbDeviceAnalytics } from "react-icons/tb";
import { FaPowerOff } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
export const FacultySidebar = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();             // Clear stored tokens
    navigate("/");       // Redirect to login page
  };

  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 80, damping: 20 } },
  };

  const linkHover = {
    hover: {
      scale: 1.05,
      backgroundColor: "#a5b4fc",
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="flex h-screen bg-gray-100"
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      <div className="hidden md:flex flex-col w-64 bg-indigo-500 fixed top-0 left-0 h-screen shadow-lg">
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <span className="text-white font-bold">Welcome, {username}</span>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 bg-indigo-500">
            <motion.div variants={linkHover} whileHover="hover">
              <NavLink
                to="/faculty"
                className="flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-indigo-300"
              >
                <MdOutlineDashboardCustomize />
                My Dashboard
              </NavLink>
            </motion.div>

            <motion.div variants={linkHover} whileHover="hover" className="mt-2">
              <NavLink
                to="create_quiz"
                className="flex items-center px-4 py-2 gap-2 text-gray-100 hover:bg-indigo-300"
              >
                <IoCreateSharp />
                 Create Quiz
              </NavLink>
            </motion.div>

            <motion.div variants={linkHover} whileHover="hover" className="mt-2">
              <NavLink
                to="faculty_analytics"
                className="flex items-center px-4 py-2 gap-2 text-gray-100 hover:bg-indigo-300"
              >
                <TbDeviceAnalytics />
                 View Analytics
              </NavLink>
            </motion.div>

            <motion.div variants={linkHover} whileHover="hover" className="mt-2">
              <NavLink
                to="faculty_profile"
                className="flex items-center px-4 py-2 gap-2 text-gray-100 hover:bg-indigo-300"
              >
                <CgProfile />
                 Profile
              </NavLink>
            </motion.div>

            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left px-4 py-2 mt-2 text-gray-100 hover:bg-indigo-300"
              whileHover={{ scale: 1.05, backgroundColor: "#a5b4fc" }}
            >
              <FaPowerOff />
              Logout
            </motion.button>

          </nav>
        </div>
      </div>
    </motion.div>
  );
};
