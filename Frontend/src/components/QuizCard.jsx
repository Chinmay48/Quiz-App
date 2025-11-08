import { motion } from "framer-motion";

export const QuizCard = ({ quiz, bgImage, onUpdate, onDelete }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="relative rounded-2xl overflow-hidden shadow-xl border border-white/10 backdrop-blur-xl h-64 group bg-gradient-to-br from-indigo-600/20 to-purple-600/20"
    >
      {/* Background image */}
      <div className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-all duration-500">
        <img
          src={bgImage}
          alt="Quiz Background"
          className="w-full h-full object-cover brightness-110"
        />
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/90"></div>

      {/* Content */}
      <div className="relative flex flex-col justify-between h-full p-5">
        <div>
          <h3 className="text-xl font-bold text-white drop-shadow-sm mb-1">
            {quiz.title}
          </h3>
          <p className="text-sm text-gray-200/80 leading-snug line-clamp-3">
            {quiz.description}
          </p>
        </div>

        {/* Buttons & info */}
        <div className="flex flex-col gap-3">
          {/* Buttons visible on hover */}
          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onUpdate(quiz)}
              className="flex-1 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(quiz)}
              className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition"
            >
              Delete
            </button>
          </div>

          {/* Duration and End Time */}
          <div className="flex justify-between items-center text-gray-200 text-xs tracking-wide">
            <span>Duration: {quiz.duration}</span>
            <span>Last Date: {new Date(quiz.end_time).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
