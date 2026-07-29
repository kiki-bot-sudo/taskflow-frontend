import { format } from "date-fns";
import { BASE } from "../constants";

async function request(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`${options?.method || "GET"} ${url} → ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

const json = (body) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const api = {
  /** Actividades del día dado, cada una con sus tareas ya incluidas. */
  async getActivitiesForDate(date) {
    const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
    const url = isToday
      ? `${BASE}/activity/today`
      : `${BASE}/activity/date/${format(date, "yyyy-MM-dd")}`;
    const acts = await request(url);
    return Promise.all(
      (Array.isArray(acts) ? acts : []).map(async (a) => ({
        ...a,
        tasks: await request(`${BASE}/activity/${a.id}/task`),
      }))
    );
  },

  async createActivity({ title, description, category, priority, date }) {
    const d = new Date(date);
    d.setHours(12, 0, 0, 0);
    return request(`${BASE}/activity`, json({ title, description, category, priority, date: d.toISOString() }));
  },

  async addTask(activityId, { title, dueTime }) {
    return request(
      `${BASE}/activity/${activityId}/task`,
      json({ title, description: "", dueTime: dueTime ? new Date(dueTime).toISOString() : null })
    );
  },

  async updateTask(activityId, task) {
    return request(`${BASE}/activity/${activityId}/task/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: task.id,
        activityId,
        title: task.title,
        description: task.description,
        isCompleted: task.isCompleted,
        dueTime: task.dueTime,
      }),
    });
  },

  async deleteTask(activityId, taskId) {
    return request(`${BASE}/activity/${activityId}/task/${taskId}`, { method: "DELETE" });
  },
};
