import { useState } from "react";
import { motion } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const GeminiQuizModal = ({ show, onClose, onApply }) => {
  const [prompt, setPrompt] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(null);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // ✅ Improved prompt that prevents markdown formatting issues
      const promptText = `
Generate ${numQuestions} multiple choice quiz questions on the topic: "${prompt}".
Difficulty: ${difficulty}.

Follow the rules strictly:
1. Return ONLY a valid JSON array (no markdown, no explanation, no labels).
2. Each question must have exactly 4 options.
3. "correct_option" must be a string: "1", "2", "3", or "4".

Example format:
[
  {
    "text": "What is React?",
    "option1": "Frontend Library",
    "option2": "Backend Framework",
    "option3": "Database",
    "option4": "Operating System",
    "correct_option": "1"
  }
]
`;

      const result = await model.generateContent(promptText);

      let responseText = result.response.text().trim();
     
      responseText = responseText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(responseText);
      setGenerated(parsed);

    } catch (err) {
      console.log("AI Error:", err);
      alert("AI could not generate quiz. Try refining the topic or reducing difficulty.");
    }

    setLoading(false);
  };

  const applyToForm = () => {
    onApply(generated);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-xl w-full max-w-lg space-y-4 shadow-xl"
      >
        <h2 className="text-xl font-bold text-indigo-600">✨ AI Quiz Generator</h2>

        <textarea
          placeholder="Enter topic or description (ex: DBMS - Join Operations)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="number"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
          className="w-full border p-3 rounded-lg"
          placeholder="Number of Questions"
          min="1"
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full border p-3 rounded-lg"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="mixed">Mixed Difficulty</option>
        </select>

        <button
          onClick={generateQuiz}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
        >
          {loading ? "Generating..." : "Generate Quiz"}
        </button>

        {generated && (
          <button
            onClick={applyToForm}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
             Use This Quiz
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full text-gray-600 hover:text-black"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};
