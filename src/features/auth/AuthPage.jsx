import { useState } from "react";
import { ArrowLeft, ChefHat, LogIn, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";

export function AuthPage({
  auth,
  accessMessage,
  onBack,
  activeView,
  navItems,
  onNavigate,
}) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setSaving(true);

    try {
      if (mode === "register") {
        const data = await auth.signUp({ name, email, password });
        setMessage(
          data.session
            ? "Cuenta creada. Ya puedes publicar recetas."
            : "Cuenta creada. Revisa tu correo para confirmarla.",
        );
      } else {
        await auth.signIn({ email, password });
        setMessage("Sesion iniciada correctamente.");
      }
    } catch (submitError) {
      setMessage(submitError.message || "No se pudo completar la solicitud.");
    } finally {
      setSaving(false);
    }
  }

  if (auth.user) {
    return (
      <main className="app-shell screen-page">
        <div className="page-container auth-page">
          <button className="back-button" onClick={onBack} type="button">
            <ArrowLeft aria-hidden="true" size={18} />
            Inicio
          </button>

          <section className="account-panel">
            <div className="account-avatar">
              <UserRound aria-hidden="true" size={30} />
            </div>
            <p>Tu cuenta</p>
            <h1>{auth.profile?.name ?? "Chef"}</h1>
            <span>{auth.user.email}</span>
            <div className={`account-role ${auth.isAdmin ? "admin" : "user"}`}>
              {auth.isAdmin ? (
                <ShieldCheck aria-hidden="true" size={17} />
              ) : (
                <ChefHat aria-hidden="true" size={17} />
              )}
              {auth.isAdmin ? "Administrador" : "Usuario registrado"}
            </div>

            {accessMessage && <p className="auth-access-message">{accessMessage}</p>}

            <button className="sign-out-button" onClick={auth.signOut} type="button">
              <LogOut aria-hidden="true" size={18} />
              Cerrar sesion
            </button>
          </section>
        </div>

        <BottomNavigation
          activeItemId={activeView}
          items={navItems}
          onNavigate={onNavigate}
        />
      </main>
    );
  }

  return (
    <main className="app-shell screen-page">
      <div className="page-container auth-page">
        <button className="back-button" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" size={18} />
          Inicio
        </button>

        <section className="auth-panel">
          <div className="auth-brand-icon">
            <ChefHat aria-hidden="true" size={28} />
          </div>
          <p>Pocket Chef</p>
          <h1>{mode === "login" ? "Bienvenido de vuelta" : "Crea tu cuenta"}</h1>
          <span>
            {mode === "login"
              ? "Entra para publicar y sincronizar tus recetas."
              : "Guarda favoritos y comparte recetas con la comunidad."}
          </span>

          {accessMessage && <p className="auth-access-message">{accessMessage}</p>}

          <div className="segmented-control auth-modes" role="tablist">
            <button
              aria-selected={mode === "login"}
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
              role="tab"
              type="button"
            >
              Iniciar sesion
            </button>
            <button
              aria-selected={mode === "register"}
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
              role="tab"
              type="button"
            >
              Registrarme
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="form-field">
                <label htmlFor="auth-name">Nombre</label>
                <input
                  autoComplete="name"
                  id="auth-name"
                  onChange={(event) => setName(event.target.value)}
                  required
                  value={name}
                />
              </div>
            )}
            <div className="form-field">
              <label htmlFor="auth-email">Correo</label>
              <input
                autoComplete="email"
                id="auth-email"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </div>
            <div className="form-field">
              <label htmlFor="auth-password">Contrasena</label>
              <input
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                id="auth-password"
                minLength="6"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </div>

            {(message || auth.error) && (
              <p className="auth-message">{message || auth.error}</p>
            )}

            <button className="auth-submit-button" disabled={saving} type="submit">
              <LogIn aria-hidden="true" size={18} />
              {saving
                ? "Procesando..."
                : mode === "login"
                  ? "Entrar"
                  : "Crear cuenta"}
            </button>
          </form>
        </section>
      </div>

      <BottomNavigation
        activeItemId={activeView}
        items={navItems}
        onNavigate={onNavigate}
      />
    </main>
  );
}
