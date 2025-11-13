import axiosInstance from "./axiosConfig";
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ---------------------- Get All Quizzes ----------------------
export const getStudentQuiz = async () => {
  const response = await axiosInstance.get(`/quiz/quizzes/`);
  return response.data;
};

// ---------------------- Get Quiz by ID ----------------------
export const getStudentQuizById = async (quizId) => {
  try {
    const response = await axiosInstance.get(`/quiz/quizzes/${quizId}/`);
    return response.data;
  } catch (error) {
    console.log("Failed to fetch quiz id:", error);
  }
};

// ---------------------- Create Submission ----------------------
export const createSubmission = async (quizId) => {
  try {
    const response = await axiosInstance.post(`/quiz/submission/`, {
      quiz: quizId,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// ---------------------- Submit an Answer ----------------------
export const submitAnswer = async (submissionId, questionId, selectedOption) => {
  try {
    const response = await axiosInstance.post(`/quiz/answers/`, {
      submission: submissionId,
      question: questionId,
      selected_option: selectedOption,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// ---------------------- Check If Student Already Attempted ----------------------
export const fetchSubmissionStatus = async (quizId) => {
  const res = await axiosInstance.get(`/quiz/${quizId}/submission-status/`);
  return res.data.attempted;
};

// ---------------------- Get Quiz Result ----------------------
export const getQuizResult = async (quizId) => {
  const res = await axiosInstance.get(`/result/quiz/${quizId}/`);
  return res.data;
};

// ---------------------- Student Analytics ----------------------
export const getStudentAnalytics = async () => {
  try {
    const response = await axiosInstance.get(`/result/student-analytics/`);
    return response.data;
  } catch (error) {
    console.log("Failed to fetch analytics:", error);
  }
};
