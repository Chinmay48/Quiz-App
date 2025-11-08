import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { logoutUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
export const StudentSidebar = ({ username }) => {
  console.log(username);
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
                to="/student"
                className="flex items-center px-4 py-2 text-gray-100 hover:bg-indigo-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
                My Dashboard
              </NavLink>
            </motion.div>

            

          
 <motion.button
              onClick={handleLogout}
              className="flex items-center w-full text-left px-4 py-2 mt-2 text-gray-100 hover:bg-indigo-300"
              whileHover={{ scale: 1.05, backgroundColor: "#a5b4fc" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Logout
            </motion.button>

          </nav>
        </div>
      </div>
    </motion.div>
  );
};
