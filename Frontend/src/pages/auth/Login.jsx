import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 px-4">
      <motion.form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-100"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h2
          className="text-3xl font-semibold mb-8 text-center text-indigo-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Welcome Back
        </motion.h2>

        <div className="space-y-5">
          <motion.input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none rounded-xl py-3 px-4 transition-all"
            whileFocus={{ scale: 1.02 }}
          />

          <motion.input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none rounded-xl py-3 px-4 transition-all"
            whileFocus={{ scale: 1.02 }}
          />

          <motion.button
            type="submit"
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl shadow-md transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            Log In
          </motion.button>
        </div>

        {/* NEW USER REDIRECT */}
        <motion.p
          className="text-center text-sm text-gray-600 mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          New user?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Create an account
          </Link>
        </motion.p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <ErrorAlert message={error} onClose={() => setError("")} />
          </motion.div>
        )}

        <motion.p
          className="text-center text-sm text-gray-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <a
            href="http://127.0.0.1:8000/admin/"
            className="text-indigo-600 font-medium hover:underline"
          >
            Admin Login
          </a>
        </motion.p>
      </motion.form>
    </div>
  );
};
