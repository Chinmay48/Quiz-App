import { useState } from "react";
import { motion } from "framer-motion";

import { useNavigate ,Link} from "react-router-dom";
import { registerUser } from "../../api/authApi";

export const Register = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "",
    department: "",
    year: "",
  });

  const [errors, setErrors] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validations
    if (form.password !== form.confirm_password) {
      setErrors("Passwords do not match");
      return;
    }

    try {
      const payload = { ...form };
      

      await registerUser(payload);

      navigate("/"); 
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data || "Registration failed");
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
        Create Your Account
      </h2>

      {errors && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg mb-4">
          {JSON.stringify(errors)}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-6 space-y-5"
      >
        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
          required
        />

        {/* First + Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
          required
        />

        {/* Confirm Password */}
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          value={form.confirm_password}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
          required
        />

        {/* Role */}
        <div>
          <label className="font-medium">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">-- Choose Role --</option>
            <option value="faculty">Faculty</option>
            <option value="student">Student</option>
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="font-medium">Department</label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">-- Select Department --</option>
            <option value="COMP">COMP</option>
            <option value="IT">IT</option>
            <option value="AIDS">AIDS</option>
            <option value="AIML">AIML</option>
            <option value="EXTC">EXTC</option>
            <option value="MECH">MECH</option>
            <option value="IOT">IOT</option>
          </select>
        </div>

        <motion.p
                  className="text-center text-sm text-gray-600 mt-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Already have an account?{" "}
                  <Link
                    to="/"
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    Login 
                  </Link>
                </motion.p>

        {/* Year — only if role = student */}
        {form.role === "student" && (
          <div>
            <label className="font-medium">Year</label>
            <select
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              required={form.role === "student"}
            >
              <option value="">-- Select Year --</option>
              <option value="FE">FE</option>
              <option value="SE">SE</option>
              <option value="TE">TE</option>
              <option value="BE">BE</option>
            </select>
          </div>
        )}

        {/* Submit */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition"
        >
          Register
        </motion.button>
      </form>
    </motion.div>
  );
};
