import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { useToast } from "./useToast";

export function useActivities(date) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = useCallback(
    async (d) => {
      setLoading(true);
      try {
        setActivities(await api.getActivitiesForDate(d));
      } catch {
        setActivities([]);
        showToast("No se pudo cargar tu agenda", "error");
      }
      setLoading(false);
    },
    [showToast]
  );

  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-date-change es el patrón estándar aquí
  useEffect(() => { load(date); }, [date, load]);

  const createActivity = useCallback(
    async (form, forDate) => {
      try {
        const a = await api.createActivity({ ...form, date: forDate });
        setActivities((p) => [...p, { ...a, tasks: [] }]);
        showToast("Actividad creada", "success");
        return true;
      } catch {
        showToast("No se pudo crear la actividad", "error");
        return false;
      }
    },
    [showToast]
  );

  const addTask = useCallback(
    async (activityId, title, dueTime) => {
      try {
        const t = await api.addTask(activityId, { title, dueTime });
        setActivities((p) => p.map((a) => (a.id !== activityId ? a : { ...a, tasks: [...a.tasks, t] })));
        showToast(dueTime ? "Tarea con fecha límite agregada" : "Tarea agregada", "success");
      } catch {
        showToast("No se pudo agregar la tarea", "error");
      }
    },
    [showToast]
  );

  const toggleTask = useCallback(
    async (activityId, task) => {
      try {
        const updated = await api.updateTask(activityId, { ...task, isCompleted: !task.isCompleted });
        setActivities((p) =>
          p.map((a) => {
            if (a.id !== activityId) return a;
            const tasks = a.tasks.map((t) => (t.id === task.id ? updated : t));
            const isCompleted = tasks.length > 0 && tasks.every((t) => t.isCompleted);
            if (isCompleted && !a.isCompleted) showToast("¡Actividad completada!", "success");
            return { ...a, tasks, isCompleted };
          })
        );
      } catch {
        showToast("No se pudo actualizar la tarea", "error");
      }
    },
    [showToast]
  );

  const deleteTask = useCallback(
    async (activityId, taskId) => {
      try {
        await api.deleteTask(activityId, taskId);
        setActivities((p) => p.map((a) => (a.id !== activityId ? a : { ...a, tasks: a.tasks.filter((t) => t.id !== taskId) })));
        showToast("Tarea eliminada", "info");
      } catch {
        showToast("No se pudo eliminar la tarea", "error");
      }
    },
    [showToast]
  );

  const addSubTask = useCallback(async (activityId, taskId, title) => {
    try {
      const subTask = await api.addSubTask(taskId, title);
      setActivities((items) => items.map((activity) => activity.id !== activityId ? activity : {
        ...activity,
        tasks: activity.tasks.map((task) => task.id !== taskId ? task : {
          ...task, subTasks: [...(task.subTasks || []), subTask],
        }),
      }));
      showToast("Subtarea agregada", "success");
    } catch (error) { showToast(error.message, "error"); }
  }, [showToast]);

  const toggleSubTask = useCallback(async (activityId, taskId, subTask) => {
    try {
      const updated = await api.toggleSubTask(taskId, subTask);
      setActivities((items) => items.map((activity) => activity.id !== activityId ? activity : {
        ...activity,
        tasks: activity.tasks.map((task) => task.id !== taskId ? task : {
          ...task, subTasks: (task.subTasks || []).map((item) => item.id === subTask.id ? updated : item),
        }),
      }));
    } catch (error) { showToast(error.message, "error"); }
  }, [showToast]);

  const deleteSubTask = useCallback(async (activityId, taskId, subTaskId) => {
    try {
      await api.deleteSubTask(taskId, subTaskId);
      setActivities((items) => items.map((activity) => activity.id !== activityId ? activity : {
        ...activity,
        tasks: activity.tasks.map((task) => task.id !== taskId ? task : {
          ...task, subTasks: (task.subTasks || []).filter((item) => item.id !== subTaskId),
        }),
      }));
      showToast("Subtarea eliminada", "info");
    } catch (error) { showToast(error.message, "error"); }
  }, [showToast]);

  return { activities, loading, createActivity, addTask, toggleTask, deleteTask, addSubTask, toggleSubTask, deleteSubTask };
}
