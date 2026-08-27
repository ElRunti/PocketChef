import { useState } from "react";
import { supabase } from "../lib/supabase.js";
import { AuthHeader } from "./components/AuthHeader.jsx";

function LoginPage({ onLogin, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    if (!email.trim()) {
      setMessage("Ingresa tu correo.");
      setLoading(false);
      return;
    }

    if (!password) {
      setMessage("Ingresa tu contrasena.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    onLogin(data.user);
  };

  return (
    <main className="app-shell">
      <div className="page-container auth-page">
        <AuthHeader />

        <section className="auth-card">
          <div className="section-heading">
            <div>
              <p>Bienvenido</p>
              <h2>Iniciar sesion</h2>
            </div>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="auth-field">
              <label htmlFor="email">Correo</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="correo@ejemplo.com"
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Contrasena</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Contrasena"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar sesion"}
            </button>
          </form>

          <p className="auth-switch">
            No tienes cuenta?{" "}
            <button type="button" onClick={() => onNavigate("register")}>
              Registrate
            </button>
          </p>

          {message && <p className="auth-message">{message}</p>}
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
