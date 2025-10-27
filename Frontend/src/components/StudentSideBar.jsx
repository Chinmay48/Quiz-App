import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export const StudentSidebar = ({ username }) => {
  console.log(username);

 
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

            

            <motion.a
              href="#"
              className="flex items-center px-4 py-2 mt-2 text-gray-100"
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
                  d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
                />
              </svg>
              View Analytics
            </motion.a>

            <motion.a
              href="#"
              className="flex items-center px-4 py-2 mt-2 text-gray-100"
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
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                />
              </svg>
              View Profile
            </motion.a>

            <motion.a
              href="#"
              className="flex items-center px-4 py-2 mt-2 text-gray-100"
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
            </motion.a>

          </nav>
        </div>
      </div>
    </motion.div>
  );
};
