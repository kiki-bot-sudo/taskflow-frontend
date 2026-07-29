const BASE = "https://localhost:57306/api";

const json = (r) => r.json();

export const getToday        = () => fetch(`${BASE}/activity/today`).then(json);
export const getTasks        = (id) => fetch(`${BASE}/activity/${id}/task`).then(json);
export const createActivity  = (body) => fetch(`${BASE}/activity`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }).then(json);
export const createTask      = (actId, body) => fetch(`${BASE}/activity/${actId}/task`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }).then(json);
export const updateTask      = (actId, id, body) => fetch(`${BASE}/activity/${actId}/task/${id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }).then(json);
export const deleteTask      = (actId, id) => fetch(`${BASE}/activity/${actId}/task/${id}`, { method:"DELETE" });
export const deleteActivity  = (id) => fetch(`${BASE}/activity/${id}`, { method:"DELETE" });