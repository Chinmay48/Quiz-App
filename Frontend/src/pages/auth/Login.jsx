import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorAlert } from "../../components/ErrorAlert";
import { loginUser, getUserProfile } from "../../api/authApi";
import { motion } from "framer-motion";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { access, refresh } = await loginUser(username, password);
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      const userResponse = await getUserProfile();
      

      if (userResponse.role === "faculty") {
        navigate("/faculty");
      } else if (userResponse.role === "student") {
        navigate("/student");
      } else {
        setError("Role not recognized");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <motion.form
        className="bg-white text-gray-500 max-w-[350px] mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10"
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h2
          className="text-2xl font-semibold mb-6 text-center text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Login Here
        </motion.h2>

        <motion.input
          id="username"
          className="w-full border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          whileFocus={{ scale: 1.02, borderColor: "#4f46e5" }}
          transition={{ duration: 0.2 }}
        />

        <motion.input
          id="password"
          className="w-full border mt-1 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          whileFocus={{ scale: 1.02, borderColor: "#4f46e5" }}
          transition={{ duration: 0.2 }}
        />

        <motion.button
          type="submit"
          className="w-full mb-3 bg-indigo-500 text-white py-3.5 rounded-full"
          whileHover={{ scale: 1.05, backgroundColor: "#4338ca" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          Log in
        </motion.button>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ErrorAlert message={error} onClose={() => setError("")} />
          </motion.div>
        )}

        <motion.p
          className="text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <a
            href="http://127.0.0.1:8000/admin/"
            className="text-blue-500 underline"
          >
            Admin Login
          </a>
        </motion.p>
      </motion.form>
    </div>
  );
};
