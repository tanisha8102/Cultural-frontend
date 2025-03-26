import config from "./config";

const API_BASE_URL = config.API_BASE_URL;

const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
    credentials: "include", // ✅ Ensure cookies are sent for refresh
  });

  if (response.status === 401) {
    console.log("Access token expired. Attempting to refresh...");

    const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      credentials: "include", // ✅ Required for refresh token in cookies
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      localStorage.setItem("token", refreshData.accessToken); // ✅ Store new access token

      // Retry original request with the new token
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${refreshData.accessToken}`,
        },
      });
    } else {
      console.log("Refresh token expired. Logging out...");
      localStorage.clear();
      window.location.href = "/login"; // Redirect to login
    }
  }

  return response;
};

export default fetchWithAuth;
