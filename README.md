# Pocket Chef

Pocket Chef es una app mobile-first hecha con React y JavaScript.

## Tecnologias

- React
- JavaScript
- Vite
- Supabase
- Capacitor para Android
- CSS
- Lucide React

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
npm run android:sync
npm run android:apk
```

## Android

PocketChef empaqueta el build de Vite dentro de una aplicacion Android. No
necesita un dominio ni un servidor local para abrir la interfaz; Supabase si
requiere conexion a internet para autenticacion y datos.

Para generar un APK de desarrollo en Windows:

```powershell
npm install
npm run android:apk
```

El archivo se genera en:

```txt
android/app/build/outputs/apk/debug/app-debug.apk
```

El workflow `Build Android APK` tambien compila el APK en GitHub Actions al
subir cambios a `develop`. Antes de ejecutarlo, agrega estos secretos en
`Settings > Secrets and variables > Actions`:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Al terminar el workflow, el APK se descarga desde el artefacto
`pocketchef-debug-apk`.

## Estructura

```txt
src/
  features/
    home/
      HomePage.jsx
      components/
    recipes/
      data/
  shared/
    components/
    styles/
```

## Seguridad

El archivo `.gitignore` evita subir dependencias, builds, archivos temporales,
variables de entorno y archivos comunes de credenciales.
