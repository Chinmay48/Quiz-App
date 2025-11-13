import axios from "axios";
import axiosInstance from "./axiosConfig";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ---------------------- Get All Quizzes ----------------------
export const getFacultyQuizzes = async () => {
  const response = await axiosInstance.get(`/quiz/quizzes/`);
  return response.data;
};

// ---------------------- Get Quiz Questions ----------------------
export const getQuizQuestions = async (quizId) => {
  const response = await axiosInstance.get(`/quiz/question/${quizId}/`);
  return response.data;
};

// ---------------------- Get Submissions ----------------------
export const getQuizSubmission = async (quizId) => {
  const response = await axiosInstance.get(`/quiz/submission/${quizId}/`);
  return response.data;
};

// ---------------------- Create Quiz ----------------------
export const createQuiz = async (quizData) => {
  const response = await axiosInstance.post(`/quiz/quizzes/`, quizData);
  return response.data;
};

// ---------------------- Delete Quiz ----------------------
export const deleteQuiz = async (quizId) => {
  const response = await axiosInstance.delete(
    `/quiz/quizzes/${quizId}/delete/`
  );
  return response.data;
};

// ---------------------- Update Quiz ----------------------
export const updateQuiz = async (quizId, data) => {
  const response = await axiosInstance.put(
    `/quiz/quizzes/${quizId}/update/`,
    data
  );
  return response.data;
};

// ---------------------- Get Quiz by ID ----------------------
export const getFacultyQuizById = async (quizId) => {
  try {
    const response = await axiosInstance.get(`/quiz/quizzes/${quizId}/`);
    return response.data;
  } catch (error) {
    console.log("Failed to fetch quiz id:", error);
  }
};

// ---------------------- Faculty Analytics ----------------------
export const getFacultyAnalytics = async () => {
  try {
    const response = await axiosInstance.get(`/result/faculty-analytics/`);
    return response.data;
  } catch (error) {
    console.log("Failed to fetch analytics:", error);
  }
};

// ---------------------- Quiz Detailed Analytics ----------------------
export const getFacultyAnalyticsDetails = async (quizId) => {
  try {
    const response = await axiosInstance.get(
      `/result/quiz-detail-analytics/${quizId}/`
    );
    return response.data;
  } catch (error) {
    console.log("Failed to fetch detail quiz analytics:", error);
  }
};
