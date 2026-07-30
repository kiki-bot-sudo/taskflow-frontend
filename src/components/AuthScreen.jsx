import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { api } from "../lib/api";

const field = "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition focus:border-thread";

export default function AuthScreen({ onAuthenticated }) {
  const [register, setRegister] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ displayName: "", email: "", password: "", confirmPassword: "" });

  async function submit(event) {
    event.preventDefault();
    if (register && form.password !== form.confirmPassword) return setError("Las contraseñas no coinciden.");
    setLoading(true); setError("");
    try {
      const user = register
        ? await api.register(form.displayName, form.email, form.password, form.confirmPassword)
        : await api.login(form.email, form.password);
      onAuthenticated(user);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5 py-12">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-line bg-paper-light shadow-pop md:grid-cols-2">
        <section className="hidden bg-ink p-12 text-paper-light md:flex md:flex-col md:justify-center">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-thread font-display text-xl font-black">TF</div>
          <p className="font-mono text-xs tracking-[.25em] text-paper-dark">TASKFLOW</p>
          <h1 className="mt-4 font-display text-4xl font-black">{register ? "Empieza a organizarte." : "Organiza tus días con claridad."}</h1>
          <p className="mt-4 text-sm leading-6 text-paper-dark">Tus tareas y subtareas permanecen separadas de las demás cuentas.</p>
        </section>
        <section className="p-8 sm:p-12">
          <h2 className="font-display text-3xl font-bold">{register ? "Crear cuenta" : "Bienvenido"}</h2>
          <p className="mt-2 text-sm text-ink-faint">{register ? "Completa tus datos para comenzar." : "Inicia sesión para ver tu agenda."}</p>
          <form className="mt-8 space-y-4" onSubmit={submit}>
            {register && <label className="block text-xs font-bold">Nombre<input className={`${field} mt-2`} required maxLength={80} value={form.displayName} onChange={e => setForm({...form,displayName:e.target.value})}/></label>}
            <label className="block text-xs font-bold">Correo<input className={`${field} mt-2`} required type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})}/></label>
            <label className="block text-xs font-bold">Contraseña<div className="relative mt-2"><input className={`${field} pr-12`} required minLength={6} type={show?"text":"password"} value={form.password} onChange={e => setForm({...form,password:e.target.value})}/><button type="button" onClick={()=>setShow(!show)} className="absolute inset-y-0 right-3 text-ink-faint">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
            {register && <><p className="text-[11px] text-ink-faint">Usa mayúscula, minúscula, número y al menos 6 caracteres.</p><label className="block text-xs font-bold">Confirmar contraseña<input className={`${field} mt-2`} required minLength={6} type="password" value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})}/></label></>}
            {error && <p role="alert" className="rounded-lg bg-thread-soft px-3 py-2 text-xs font-semibold text-thread">{error}</p>}
            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-thread py-3 text-sm font-bold text-paper-light disabled:opacity-60">{loading&&<LoaderCircle className="animate-spin" size={17}/>} {register?"Crear cuenta":"Iniciar sesión"}</button>
          </form>
          <p className="mt-6 text-center text-xs text-ink-faint">{register?"¿Ya tienes cuenta?":"¿No tienes cuenta?"} <button onClick={()=>{setRegister(!register);setError("")}} className="font-bold text-thread">{register?"Iniciar sesión":"Crear cuenta"}</button></p>
        </section>
      </div>
    </main>
  );
}
