import fs from 'fs';

let content = fs.readFileSync('src/App.jsx', 'utf8');

// Replace imports
content = content.replace(
  'import Toast from "./components/Toast";',
  'import { ToastProvider, useToast } from "./hooks/useToast";'
);

// Remove toast state
content = content.replace(
  'const [toast, setToast]           = useState(null);',
  ''
);

// Replace notify with showToast
content = content.replace(
  'const notify = msg => setToast(msg);',
  'const { showToast } = useToast();'
);

// Replace notify calls
content = content.replace(
  'notify("✓ Actividad creada");',
  'showToast("✓ Actividad creada", "success");'
);
content = content.replace(
  'notify("Error al crear");',
  'showToast("Error al crear", "error");'
);
content = content.replace(
  'notify(dueTime ? "⏱ Tarea con deadline agregada" : "✓ Tarea agregada");',
  'showToast(dueTime ? "⏱ Tarea con deadline agregada" : "✓ Tarea agregada", "success");'
);
content = content.replace(
  'notify("Error al agregar tarea");',
  'showToast("Error al agregar tarea", "error");'
);
content = content.replace(
  'notify("🎉 ¡Actividad completada!");',
  'showToast("🎉 ¡Actividad completada!", "success");'
);
content = content.replace(
  'notify("Tarea eliminada");',
  'showToast("Tarea eliminada", "info");'
);

// Remove old Toast component usage
content = content.replace(
  '{toast && <Toast msg={toast} onDone={() => setToast(null)} />}',
  ''
);

// Change export default function App to function AppContent
content = content.replace(
  'export default function App()',
  'function AppContent()'
);

// Add new App wrapper at the end
const newAppWrapper = `

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}`;

// Find the last closing brace and insert before it
const lastBraceIndex = content.lastIndexOf('}');
if (lastBraceIndex !== -1) {
  content = content.slice(0, lastBraceIndex) + newAppWrapper + content.slice(lastBraceIndex);
}

fs.writeFileSync('src/App.jsx', content);
console.log('App.jsx updated successfully');