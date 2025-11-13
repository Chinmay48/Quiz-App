import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchSubmissionStatus } from "../api/studentApi";
import { BsThreeDotsVertical } from "react-icons/bs";

export const StudentQuizCard = ({ quiz, bgImage, onAttempt }) => {
  const [attempted, setAttempted] = useState(false);
  const [showOptions, setShowOptions] = useState(false); // mobile toggle

  useEffect(() => {
    const fetchStatus = async () => {
      const response = await fetchSubmissionStatus(quiz.id);
      setAttempted(response);
    };
    fetchStatus();
  }, [quiz.id]);

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="relative rounded-2xl overflow-hidden shadow-xl border border-white/10 backdrop-blur-xl h-64 group bg-gradient-to-br from-indigo-600/20 to-purple-600/20"
    >
      {/* Background Image */}
      <div className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-all duration-500">
        <img
          src={bgImage}
          alt="Quiz Background"
          className="w-full h-full object-cover brightness-110"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/90"></div>

      {/* Card Content */}
      <div className="relative flex flex-col justify-between h-full p-5">

        {/* Title + 3 dots (mobile only) */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white drop-shadow-sm mb-1">
              {quiz.title}
            </h3>
            <p className="text-sm text-gray-200/80 leading-snug line-clamp-3">
              {quiz.description}
            </p>
          </div>

          {/* Mobile Options Button */}
          <button
            className="md:hidden text-white text-xl p-1"
            onClick={() => setShowOptions(!showOptions)}
          >
            <BsThreeDotsVertical />
          </button>
        </div>

        {/* Attempt Button (desktop hover + mobile toggle) */}
        {(showOptions || true) && (
          <div
            className={`
              mt-4
              ${showOptions ? "block" : "hidden md:block"}
              opacity-100 md:opacity-0 md:group-hover:opacity-100
              transition-opacity duration-300
            `}
          >
            <button
              disabled={attempted}
              onClick={() => onAttempt(quiz)}
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium shadow-md transition
                ${
                  attempted
                    ? "bg-gray-600 cursor-not-allowed text-white"
                    : "bg-indigo-500 hover:bg-indigo-600 text-white"
                }`}
            >
              {attempted ? "Already Attempted" : "Attempt Quiz"}
            </button>
          </div>
        )}

        {/* Bottom Info */}
        <div className="flex justify-between items-center text-gray-200 text-xs tracking-wide mt-3">
          <span>Duration: {quiz.duration}</span>
          <span>End Date: {new Date(quiz.end_time).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
};
