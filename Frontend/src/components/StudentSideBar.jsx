import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logoutUser } from "../api/authApi";

import { MdOutlineDashboardCustomize } from "react-icons/md";
import { TbDeviceAnalytics } from "react-icons/tb";
import { FaPowerOff } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

const SidebarLinks = ({ handleLogout, onLinkClick }) => {
  const hoverEffect = "hover:bg-indigo-300 hover:scale-[1.03] transition-all";

  const linkStyle =
    "flex items-center gap-3 p-2 rounded-lg text-gray-100 " + hoverEffect;

  return (
    <nav className="flex flex-col flex-1 p-4 gap-2 text-gray-100">
      <NavLink to="/student" className={linkStyle} onClick={onLinkClick}>
        <MdOutlineDashboardCustomize size={20} />
        <span>My Dashboard</span>
      </NavLink>

      <NavLink to="student_analytics" className={linkStyle} onClick={onLinkClick}>
        <TbDeviceAnalytics size={20} />
        <span>View Analytics</span>
      </NavLink>

      <NavLink to="student_profile" className={linkStyle} onClick={onLinkClick}>
        <CgProfile size={20} />
        <span>Profile</span>
      </NavLink>

      <button
        onClick={handleLogout}
        className={`mt-auto flex items-center gap-3 p-2 rounded-lg text-left ${hoverEffect}`}
      >
        <FaPowerOff size={20} />
        <span>Logout</span>
      </button>
    </nav>
  );
};

const StudentSidebar = ({ username, isOpen = false, onClose = () => {} }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const sidebarVariants = {
    hidden: { x: -300 },
    visible: { x: 0 },
    exit: { x: -300 },
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-indigo-500 fixed top-0 left-0 h-screen shadow-lg z-40 overflow-y-auto">
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <span className="text-white font-bold">Welcome, {username}</span>
        </div>

        <SidebarLinks handleLogout={handleLogout} onLinkClick={() => {}} />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Drawer */}
            <motion.aside
              className="fixed top-0 left-0 w-64 h-screen bg-indigo-500 shadow-xl z-50 overflow-y-auto flex flex-col"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", stiffness: 90, damping: 14 }}
            >
              <div className="flex items-center justify-between h-16 bg-gray-900 px-4">
                <span className="text-white font-bold">Welcome, {username}</span>
                <button onClick={onClose} className="text-white text-xl font-bold">
                  ✕
                </button>
              </div>

              <SidebarLinks handleLogout={handleLogout} onLinkClick={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudentSidebar;
