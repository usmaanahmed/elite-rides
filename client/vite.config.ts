import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  // Admin panel 5173 par chalta hai, website hamesha 5174 par (server ke CLIENT_URL me yahi likha hai)
  server: {
    port: 5174,
    strictPort: true,
  },
})
