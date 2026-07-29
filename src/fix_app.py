import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace import
content = content.replace('import Toast from "./components/Toast"', 'import { ToastProvider, useToast } from "./hooks/useToast"')

# Remove toast state
content = re.sub(r'const \[toast, setToast\]\s*=\s*useState\(null\);\n', '', content)

# Replace notify with showToast
content = content.replace('const notify = msg => setToast(msg);', 'const { showToast } = useToast();')

# Replace notify calls
content = content.replace('notify("✓ Actividad creada");', 'showToast("✓ Actividad creada", "success");')
content = content.replace('notify("Error al crear");', 'showToast("Error al crear", "error");')
content = content.replace('notify(dueTime ? "⏱ Tarea con deadline agregada" : "✓ Tarea agregada");', 'showToast(dueTime ? "⏱ Tarea con deadline agregada" : "✓ Tarea agregada", "success");')
content = content.replace('notify("Error al agregar tarea");', 'showToast("Error al agregar tarea", "error");')
content = content.replace('notify("🎉 ¡Actividad completada!");', 'showToast("🎉 ¡Actividad completada!", "success");')
content = content.replace('notify("Tarea eliminada");', 'showToast("Tarea eliminada", "info");')

# Remove old Toast component usage
content = content.replace('{toast && <Toast msg={toast} onDone={() => setToast(null)} />}', '')

# Change export default function App to function AppContent
content = content.replace('export default function App()', 'function AppContent()')

# Add new App wrapper at the end - find last } and add before it
lines = content.split('\n')
for i in range(len(lines) - 1, -1, -1):
    if lines[i].strip() == '}':
        wrapper = '\n\nexport default function App() {\n  return (\n    <ToastProvider>\n      <AppContent />\n    </ToastProvider>\n  );\n}'
        lines.insert(i, wrapper)
        break

content = '\n'.join(lines)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')