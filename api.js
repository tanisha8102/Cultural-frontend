import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Backend URL
  withCredentials: true, // Required to send cookies (for refresh token)
});

// Request interceptor to attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle expired access tokens
api.interceptors.response.use(
    (response) => response, // If response is fine, return it
    async (error) => {
      const originalRequest = error.config;
  
      // If access token expired
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Prevent infinite loops
  
        try {
          // Request new access token
          const { data } = await axios.post("http://localhost:5000/api/auth/refresh-token", {}, { withCredentials: true });
  
          // Set new token for future requests
          localStorage.setItem("accessToken", data.accessToken);
          api.defaults.headers["Authorization"] = `Bearer ${data.accessToken}`;
  
          // Retry original request with new access token
          originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Refresh Token Failed:", refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  
export default api;
