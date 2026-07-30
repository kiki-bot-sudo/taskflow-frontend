# TaskFlow Frontend

Frontend React + Vite para la agenda personal TaskFlow.

## Funciones

- Registro, inicio y cierre de sesión.
- Cookies seguras administradas por el backend.
- Actividades y tareas del usuario autenticado.
- Creación, completado y eliminación de tareas.
- Subtareas por cada tarea.
- Diseño responsive con Tailwind CSS.

## Desarrollo local

El backend debe ejecutarse en `http://localhost:5080`.

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Abrir `http://localhost:5173`.

## Configuración

```text
VITE_API_URL=http://localhost:5080/api
```

En Azure o cualquier hosting del frontend, configurar `VITE_API_URL` con la URL HTTPS real del backend antes de compilar.

El backend debe incluir la URL pública del frontend en:

```text
Cors__AllowedOrigins__0=https://url-real-del-frontend
```

No guardar contraseñas, perfiles de publicación ni secretos en este repositorio.

## Validación

```powershell
npm run lint
npm run build
```
