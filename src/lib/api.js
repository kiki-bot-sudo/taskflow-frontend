import { format } from "date-fns";
import { BASE } from "../constants";

async function request(url, options) {
  const res = await fetch(url, { credentials: "include", ...options });
  if (res.status === 401) {
    window.dispatchEvent(new Event("taskflow:unauthorized"));
    throw new Error("Debes iniciar sesión.");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || data?.title || Object.values(data?.errors || {}).flat()[0] || "No fue posible completar la operación.");
  }
  if (res.status === 204) return null;
  return res.json();
}

const json = (body) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const api = {
  me: () => request(`${BASE}/auth/me`),
  login: (email, password) => request(`${BASE}/auth/login`, json({ email, password })),
  register: (displayName, email, password, confirmPassword) =>
    request(`${BASE}/auth/register`, json({ displayName, email, password, confirmPassword })),
  logout: () => request(`${BASE}/auth/logout`, { method: "POST" }),

  async getActivitiesForDate(date) {
    const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
    const url = isToday ? `${BASE}/activity/today` : `${BASE}/activity/date/${format(date, "yyyy-MM-dd")}`;
    const acts = await request(url);
    return Promise.all((Array.isArray(acts) ? acts : []).map(async (a) => ({
      ...a,
      tasks: await request(`${BASE}/activity/${a.id}/task`),
    })));
  },

  async createActivity({ title, description, category, priority, date }) {
    const d = new Date(date);
    d.setHours(12, 0, 0, 0);
    return request(`${BASE}/activity`, json({ title, description, category, priority, date: d.toISOString() }));
  },

  addTask(activityId, { title, dueTime }) {
    return request(`${BASE}/activity/${activityId}/task`, json({
      title, description: "", priority: "Medium",
      dueTime: dueTime ? new Date(dueTime).toISOString() : null,
    }));
  },

  updateTask(activityId, task) {
    return request(`${BASE}/activity/${activityId}/task/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title, description: task.description, priority: task.priority || "Medium",
        isCompleted: task.isCompleted, dueTime: task.dueTime,
      }),
    });
  },

  deleteTask: (activityId, taskId) =>
    request(`${BASE}/activity/${activityId}/task/${taskId}`, { method: "DELETE" }),
  addSubTask: (taskId, title) =>
    request(`${BASE}/tasks/${taskId}/subtasks`, json({ title })),
  toggleSubTask: (taskId, subTask) =>
    request(`${BASE}/tasks/${taskId}/subtasks/${subTask.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: !subTask.isCompleted }),
    }),
  deleteSubTask: (taskId, subTaskId) =>
    request(`${BASE}/tasks/${taskId}/subtasks/${subTaskId}`, { method: "DELETE" }),
};
