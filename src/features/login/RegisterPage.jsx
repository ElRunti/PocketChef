import { useState } from "react";
import { supabase } from "../lib/supabase.js";
import { AuthHeader } from "./components/AuthHeader.jsx";

function RegisterPage({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    if (!email.trim()) {
      setMessage("Ingresa tu correo.");
      setLoading(false);
      return;
    }

    if (!password) {
      setMessage("Ingresa una contrasena.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Registro exitoso. Revisa tu correo para confirmar tu cuenta."
    );
    setLoading(false);
  };

  return (
    <main className="app-shell">
      <div className="page-container auth-page">
        <AuthHeader />

        <section className="auth-card">
          <div className="section-heading">
            <div>
              <p>Nueva cuenta</p>
              <h2>Crear cuenta</h2>
            </div>
          </div>

          <form onSubmit={handleRegister} className="auth-form">
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
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="auth-switch">
            Ya tienes cuenta?{" "}
            <button type="button" onClick={() => onNavigate("login")}>
              Inicia sesion
            </button>
          </p>

          {message && <p className="auth-message">{message}</p>}
        </section>
      </div>
    </main>
  );
}

export default RegisterPage;
