import { motion } from "framer-motion";

export const QuizCard = ({ quiz, bgImage, onUpdate, onDelete }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="relative rounded-xl overflow-hidden shadow-lg  h-56 md:h-64 group"
    >
      {/* Small centered image */}
      <div className="flex flex-row justify-center items-center pt-8">
        <img
          src={bgImage}
          alt="Quiz Background"
          className="w-24 h-24 object-contain rounded-md shadow-sm transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Overlay with text */}
      <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.21_0.03_263.45)] via-black/40 to-transparent p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-indigo-700 drop-shadow-md mb-2">
            {quiz.title}
          </h3>
          <p className="text-sm text-indigo-400 drop-shadow-md line-clamp-3">
            {quiz.description}
          </p>
        </div>

        {/* Bottom section: buttons + duration/end time */}
        <div className="flex flex-col gap-2">
          {/* Buttons (appear on hover) */}
          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onUpdate(quiz)}
              className="flex-1 px-3 py-1 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md text-sm"
            >
              Update Quiz
            </button>
            <button
              onClick={() => onDelete(quiz)}
              className="flex-1 px-3 py-1 bg-red-600 cursor-pointer hover:bg-red-700 text-white rounded-lg shadow-md text-sm"
            >
              Delete Quiz
            </button>
          </div>

          {/* Duration and End Time */}
          <div className="mt-2 flex justify-between items-center text-gray-100 text-sm font-medium">
            <span>Duration {quiz.duration} </span>
            <span>End Time {new Date(quiz.end_time).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
