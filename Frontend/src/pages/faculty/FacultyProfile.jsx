import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getUserProfile } from "../../api/authApi";
import profile_image from "../../assets/profile.png";
import { ChangePasswordModal } from "../../components/ChangePasswordModal";
export const FacultyProfile = ({ onUpdatePassword }) => {
  const [user, setUser] = useState(null);
  const[showmodal,setShowmodal]=useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userdetails = await getUserProfile();
        setUser(userdetails);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-center">
          <motion.img
            src={profile_image}
            alt="Profile"
            className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          />
          <h2 className="text-2xl font-semibold text-white mt-3">
            {user?.user?.first_name} {user?.user?.last_name}
          </h2>
          <p className="text-indigo-200 text-sm">{user?.role?.toUpperCase()}</p>
        </div>

        {/* Info Section */}
        <div className="p-6 space-y-4 text-left">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-800 font-medium break-all">{user?.user?.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="text-gray-800 font-medium">{user?.department}</p>
          </div>

          {user?.year && (
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="text-gray-800 font-medium">{user?.year}</p>
            </div>
          )}

          {/* Update Password Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-medium shadow hover:bg-indigo-700 transition"
            onClick={()=>setShowmodal(true)}
          >
            Update Password
          </motion.button>
          <ChangePasswordModal 
   isOpen={showmodal} 
   onClose={() => setShowmodal(false)} 
/>
        </div>
      </motion.div>
    </div>
  );
};
