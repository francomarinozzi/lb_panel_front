import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Definimos __dirname manualmente (necesario en módulos nuevos)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  server: {
    // Esto permite que puedas acceder desde tu celular si estás en la misma red WiFi
    host: true, 
  },
  build: {
    rollupOptions: {
      // Aquí le decimos a Vite que existen estas 3 páginas
      input: {
        main: resolve(__dirname, 'index.html'),
        precios: resolve(__dirname, 'precios.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  }
})