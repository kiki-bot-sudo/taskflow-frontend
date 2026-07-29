import { API_CONFIG } from "../utils/constants";

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
  config.signal = controller.signal;

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      throw new ApiError(
        errorData.message || `Error ${response.status}`,
        response.status,
        errorData
      );
    }

    // 204 No Content
    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new ApiError("Tiempo de espera agotado", 408);
    }
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || "Error de conexión", 0);
  }
}

export const api = {
  // Activities
  getToday: () => request("/activity/today"),
  getByDate: (date) => request(`/activity/date/${date}`),
  getById: (id) => request(`/activity/${id}`),
  create: (data) => request("/activity", { method: "POST", body: data }),
  update: (id, data) => request(`/activity/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/activity/${id}`, { method: "DELETE" }),

  // Tasks
  getTasks: (activityId) => request(`/activity/${activityId}/task`),
  createTask: (activityId, data) => request(`/activity/${activityId}/task`, { method: "POST", body: data }),
  updateTask: (activityId, taskId, data) => request(`/activity/${activityId}/task/${taskId}`, { method: "PUT", body: data }),
  deleteTask: (activityId, taskId) => request(`/activity/${activityId}/task/${taskId}`, { method: "DELETE" }),
  toggleTask: (activityId, taskId, isCompleted) => 
    request(`/activity/${activityId}/task/${taskId}`, { 
      method: "PUT", 
      body: { isCompleted } 
    }),
};

export { ApiError };