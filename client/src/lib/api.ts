import { apiRequest } from "./queryClient";

// User APIs
export const userApi = {
  getCurrentUser: () => apiRequest("GET", "/api/user"),
  getProgress: (userId: number) => apiRequest("GET", `/api/user/${userId}/progress`),
  getDailyStats: (userId: number, date: string) => apiRequest("GET", `/api/user/${userId}/stats/${date}`),
  getAppointments: (userId: number) => apiRequest("GET", `/api/user/${userId}/appointments`),
  getActivity: (userId: number) => apiRequest("GET", `/api/user/${userId}/activity`),
};

// Subject APIs
export const subjectApi = {
  getAll: () => apiRequest("GET", "/api/subjects"),
};

// Course APIs
export const courseApi = {
  getBySlug: (slug: string) => apiRequest("GET", `/api/courses/${slug}`),
  getExercises: (courseId: number) => apiRequest("GET", `/api/courses/${courseId}/exercises`),
};

// Exercise APIs
export const exerciseApi = {
  submit: (exerciseId: number, data: any) => 
    apiRequest("POST", `/api/exercises/${exerciseId}/submit`, data),
  getResult: (userId: number, exerciseId: number) => 
    apiRequest("GET", `/api/user/${userId}/exercises/${exerciseId}/result`),
};
