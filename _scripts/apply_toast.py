with open('src/App.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('import Toast from "./components/Toast"', 'import { ToastProvider, useToast } from "./hooks/useToast"')
c = c.replace('const [toast, setToast]           = useState(null);', '')
c = c.replace('const notify = msg => setToast(msg);', 'const { showToast } = useToast();')
c = c.replace('notify("✓ Actividad creada");', 'showToast("✓ Actividad creada", "success");')
c = c.replace('notify("Error al crear");', 'showToast("Error al crear", "error");')
c = c.replace('notify(dueTime ? "⏱ Tarea con deadline agregada" : "✓ Tarea agregada");', 'showToast(dueTime ? "⏱ Tarea con deadline agregada" : "✓ Tarea agregada", "success");')
c = c.replace('notify("Error al agregar tarea");', 'showToast("Error al agregar tarea", "error");')
c = c.replace('notify("🎉 ¡Actividad completada!");', 'showToast("🎉 ¡Actividad completada!", "success");')
c = c.replace('notify("Tarea eliminada");', 'showToast("Tarea eliminada", "info");')
c = c.replace('{toast && <Toast msg={toast} onDone={() => setToast(null)} />}', '')
c = c.replace('export default function App()', 'function AppContent()')

lines = c.split('\n')
for i in range(len(lines) - 1, -1, -1):
    if lines[i].strip() == '}':
        wrapper = '\n\nexport default function App() {\n  return (\n    <ToastProvider>\n      <AppContent />\n    </ToastProvider>\n  );\n}'
        lines.insert(i, wrapper)
        break

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
print('Done')