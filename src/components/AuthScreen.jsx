import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { api } from "../lib/api";
import { getGreeting } from "../constants";
import { fmtFullDate } from "../lib/date";

const field =
  "mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-faint/70 focus:border-thread focus:ring-2 focus:ring-thread-soft";

export default function AuthScreen({ onAuthenticated }) {
  const [register, setRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function update(fieldName, value) {
    setForm((current) => ({ ...current, [fieldName]: value }));
  }

  function changeMode(nextMode) {
    setRegister(nextMode);
    setError("");
  }

  async function submit(event) {
    event.preventDefault();
    if (register && form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const user = register
        ? await api.register(form.displayName, form.email, form.password, form.confirmPassword)
        : await api.login(form.email, form.password);
      onAuthenticated(user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-paper px-5 py-12 text-ink sm:py-16">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <p className="rounded-full border border-line bg-paper-light px-4 py-1.5 font-mono text-xs font-semibold tracking-widest text-ink-soft uppercase">
          {fmtFullDate(new Date()).toUpperCase()}
        </p>

        <h1 className="mt-8 font-display text-[clamp(4rem,13vw,7.5rem)] leading-[0.9] font-black tracking-tight">
          Task<span className="text-thread italic">Flow</span>
        </h1>

        <p className="mt-6 font-display text-[clamp(1.25rem,3vw,1.8rem)] font-medium text-ink-soft">
          {getGreeting()}. Tu día, claro y en orden.
        </p>

        <div className="stitch-divider mt-10 w-full max-w-md" />

        <section className="mt-10 w-full max-w-md rounded-3xl border border-line bg-paper-light p-6 text-left shadow-card sm:p-8">
          <div className="mb-7 flex rounded-full border border-line bg-paper p-1">
            <button
              type="button"
              onClick={() => changeMode(false)}
              className={`flex-1 rounded-full px-4 py-2 text-xs font-bold transition ${
                !register ? "bg-ink text-paper-light shadow-card" : "text-ink-faint hover:text-ink"
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => changeMode(true)}
              className={`flex-1 rounded-full px-4 py-2 text-xs font-bold transition ${
                register ? "bg-ink text-paper-light shadow-card" : "text-ink-faint hover:text-ink"
              }`}
            >
              Crear cuenta
            </button>
          </div>

          <div className="mb-6 text-center">
            <h2 className="font-display text-2xl font-bold">
              {register ? "Comienza tu agenda" : "Continúa tu día"}
            </h2>
            <p className="mt-2 text-sm text-ink-faint">
              {register
                ? "Crea una cuenta para guardar tus tareas."
                : "Entra para consultar tus actividades y subtareas."}
            </p>
          </div>

          <form className="space-y-4" onSubmit={submit}>
            {register && (
              <label className="block text-xs font-bold">
                Nombre
                <input
                  className={field}
                  required
                  maxLength={80}
                  autoComplete="name"
                  placeholder="Tu nombre"
                  value={form.displayName}
                  onChange={(event) => update("displayName", event.target.value)}
                />
              </label>
            )}

            <label className="block text-xs font-bold">
              Correo
              <input
                className={field}
                required
                type="email"
                autoComplete="email"
                placeholder="nombre@correo.com"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
              />
            </label>

            <label className="block text-xs font-bold">
              Contraseña
              <span className="relative mt-2 block">
                <input
                  className={`${field} mt-0 pr-12`}
                  required
                  minLength={6}
                  type={showPassword ? "text" : "password"}
                  autoComplete={register ? "new-password" : "current-password"}
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={(event) => update("password", event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-3 flex items-center text-ink-faint transition hover:text-thread"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            {register && (
              <label className="block text-xs font-bold">
                Confirmar contraseña
                <input
                  className={field}
                  required
                  minLength={6}
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repite tu contraseña"
                  value={form.confirmPassword}
                  onChange={(event) => update("confirmPassword", event.target.value)}
                />
              </label>
            )}

            {register && (
              <p className="font-mono text-[10px] leading-5 text-ink-faint">
                Usa mayúscula, minúscula, número y al menos 6 caracteres.
              </p>
            )}

            {error && (
              <p role="alert" className="rounded-xl border border-thread/20 bg-thread-soft px-4 py-3 text-xs font-semibold text-thread">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-thread px-7 py-3.5 text-sm font-bold tracking-wide text-paper-light shadow-card transition hover:bg-thread-light hover:shadow-card-hover disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? (
                <LoaderCircle className="animate-spin" size={17} />
              ) : (
                <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
              )}
              {register ? "Crear mi cuenta" : "Entrar a mi agenda"}
            </button>
          </form>
        </section>

        <p className="mt-6 font-mono text-[10px] tracking-widest text-ink-faint uppercase">
          Tus tareas permanecen privadas en tu cuenta
        </p>
      </div>
    </main>
  );
}
