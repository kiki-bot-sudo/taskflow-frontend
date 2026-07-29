The user wants me to apply the suggested edit to the original code. Let me compare the two and see what changes need to be made.

Looking at the original code and suggested edit, the main differences are:

1. In `createActivity`: `api.createActivity` → `api.create`
2. In `updateActivity`: `api.updateActivity` → `api.update`
3. In `deleteActivity`: `api.deleteActivity` → `api.delete`

The rest of the code appears to be the same. The suggested edit also has the same api extension at the bottom.

I need to output the complete modified file with these changes applied.import { useState, useCallback, useEffect } from "react";
import { api } from "../api/client";
import { formatISO, startOfDay } from "date-fns";
import { useToast } from "./useToast";

export function useActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  // Cargar actividades para una fecha específica
  const loadActivities = useCallback(async (date) => {
    setLoading(true);
    setError(null);
    try {
      const isoDate = formatISO(startOfDay(date), { representation: "date" });
      const isToday = date.toDateString() === new Date().toDateString();
      
      const url = isToday ? "/activity/today" : `/activity/date/${isoDate}`;
      const acts = await api.request(url);
      
      // Cargar tareas para cada actividad
      const full = await Promise.all(
        (Array.isArray(acts) ? acts : []).map(async (a) => ({
          ...a,
          tasks: await api.getTasks(a.id).catch(() => [])
        }))
      );
      
      setActivities(full);
    } catch (err) {
      setError(err);
      setActivities([]);
      showToast(err.message || "Error al cargar actividades", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Crear actividad
  const createActivity = useCallback(async (data) => {
    try {
      const newAct = await api.create({
        ...data,
        date: formatISO(new Date(data.date), { representation: "date-time" })
      });
      setActivities(prev => [...prev, { ...newAct, tasks: [] }]);
      showToast("✓ Actividad creada", "success");
      return newAct;
    } catch (err) {
      showToast(err.message || "Error al crear actividad", "error");
      throw err;
    }
  }, [showToast]);

  // Actualizar actividad
  const updateActivity = useCallback(async (id, data) => {
    try {
      const updated = await api.update(id, data);
      setActivities(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
      showToast("✓ Actividad actualizada", "success");
      return updated;
    } catch (err) {
      showToast(err.message || "Error al actualizar", "error");
      throw err;
    }
  }, [showToast]);

  // Eliminar actividad
  const deleteActivity = useCallback(async (id) => {
    try {
      await api.delete(id);
      setActivities(prev => prev.filter(a => a.id !== id));
      showToast("Actividad eliminada", "info");
    } catch (err) {
      showToast(err.message || "Error al eliminar", "error");
      throw err;
    }
  }, [showToast]);

  // Toggle completado de actividad (basado en tareas)
  const toggleActivityComplete = useCallback((id) => {
    setActivities(prev => prev.map(a => {
      if (a.id !== id) return a;
      const completed = !a.isCompleted;
      // Actualizar todas las tareas
      const tasks = a.tasks.map(t => ({ ...t, isCompleted: completed }));
      return { ...a, isCompleted: completed, tasks };
    }));
  }, []);

  // Tasks
  const addTask = useCallback(async (activityId, taskData) => {
    try {
      const task = await api.createTask(activityId, taskData);
      setActivities(prev => prev.map(a => 
        a.id !== activityId ? a : { ...a, tasks: [...a.tasks, task] }
      ));
      showToast(taskData.dueTime ? "⏱ Tarea con deadline agregada" : "✓ Tarea agregada", "success");
      return task;
    } catch (err) {
      showToast(err.message || "Error al agregar tarea", "error");
      throw err;
    }
  }, [showToast]);

  const updateTask = useCallback(async (activityId, taskId, data) => {
    try {
      const updated = await api.updateTask(activityId, taskId, data);
      setActivities(prev => prev.map(a => 
        a.id !== activityId ? a : {
          ...a,
          tasks: a.tasks.map(t => t.id === taskId ? updated : t)
        }
      ));
      return updated;
    } catch (err) {
      showToast(err.message || "Error al actualizar tarea", "error");
      throw err;
    }
  }, [showToast]);

  const deleteTask = useCallback(async (activityId, taskId) => {
    try {
      await api.deleteTask(activityId, taskId);
      setActivities(prev => prev.map(a =>
        a.id !== activityId ? a : {
          ...a,
          tasks: a.tasks.filter(t => t.id !== taskId)
        }
      ));
      showToast("Tarea eliminada", "info");
    } catch (err) {
      showToast(err.message || "Error al eliminar tarea", "error");
      throw err;
    }
  }, [showToast]);

  const toggleTask = useCallback(async (activityId, task) => {
    const newCompleted = !task.isCompleted;
    try {
      await api.toggleTask(activityId, task.id, newCompleted);
      setActivities(prev => prev.map(a => {
        if (a.id !== activityId) return a;
        const tasks = a.tasks.map(t => t.id === task.id ? { ...t, isCompleted: newCompleted } : t);
        const allCompleted = tasks.length > 0 && tasks.every(t => t.isCompleted);
        if (allCompleted && !a.isCompleted) showToast("🎉 ¡Actividad completada!", "success");
        return { ...a, tasks, isCompleted: allCompleted };
      }));
    } catch (err) {
      showToast(err.message || "Error al actualizar tarea", "error");
      throw err;
    }
  }, [showToast]);

  return {
    activities,
    loading,
    error,
    loadActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    toggleActivityComplete,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setActivities, // para optimistic updates manuales
  };
}

// Extender api con método genérico request
import { api as baseApi } from "../api/client";
const api = {
  ...baseApi,
  request: (url) => fetch(`${baseApi.API_CONFIG?.baseURL || "https://localhost:57306/api"}${url}`)
    .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
};

export { api };