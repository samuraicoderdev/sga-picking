# Smart SGA & CRM - Documentación Técnica y Configuración Local

Si el proyecto se ve "desmaquetado" o sin estilos en tu entorno local, casi con total seguridad se debe a la **configuración de Tailwind CSS v4**. En esta reciénten entrega, Tailwind funciona a través de un plugin nativo de Vite, lo cual hace que la instalación tradicional con `tailwind.config.js` y `postcss` ya no sea necesaria, pero requiere que `vite.config.ts` y `index.css` estén configurados de una forma específica.

A continuación, te detallo todo lo necesario para que lo repliques de forma exacta.

## 1. Dependencias Principales Usadas

- **React 19** (`react`, `react-dom`): Librería base para la interfaz.
- **Vite 6** (`vite`, `@vitejs/plugin-react`): Empaquetador y entorno de desarrollo (rápido y moderno).
- **Tailwind CSS v4** (`tailwindcss`, `@tailwindcss/vite`): Framework de estilos utility-first. En su versión 4 funciona mediante un plugin de Vite en lugar de PostCSS.
- **Lucide React** (`lucide-react`): Toda la iconografía de la aplicación.
- **Motion** (`motion`): Usada para las animaciones fluidas (el nuevo nombre/paquete de Framer Motion).
- **HTML5-QRCode** (`html5-qrcode`): Librería para activar la cámara del móvil y escanear códigos de barras.

## 2. Archivo `package.json`

Asegúrate de copiar este contenido en tu `package.json` y luego ejecutar `npm install` (o `npm ci`):

```json
{
  "name": "smart-sga-crm",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "html5-qrcode": "^2.3.8",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.14",
    "@types/node": "^22.14.0",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "@vitejs/plugin-react": "^5.0.4",
    "tailwindcss": "^4.1.14",
    "typescript": "~5.8.2",
    "vite": "^6.2.3"
  }
}
```

## 3. Archivo `vite.config.ts` (CLAVE PARA LOS ESTILOS)

Para que Tailwind v4 procese correctamente los estilos, debes importar y declarar su plugin en la configuración de Vite. De lo contrario, *no compilará ninguna clase CSS* y se verá totalmente desmaquetado.

```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss() // <-- Esto inyecta Tailwind v4
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

## 4. Archivo `src/index.css` (CLAVE PARA TAILWIND)

En Tailwind v4, ya no usas las directivas `@tailwind base;` etc. Solo necesitas importar Tailwind directamente:

```css
@import "tailwindcss";

/* Opcional: tus estilos extra aquí */
```

## 5. Estructura de Componentes

La aplicación está modularizada en los siguientes componentes clave en `/src`:
- `/src/App.tsx`: Enrutador principal y layout general con el Sidebar.
- `/src/types.ts`: Declaración estricta de las interfaces de TypeScript (Product, Order, Customer, etc.).
- `/src/lib/data.ts`: Base de datos simulada (Mock) con los datos del inventario y clientes.
- `/src/components/Sidebar.tsx`: Componente de navegación izquierdo.
- `/src/views/Dashboard.tsx`: Vista de resumen (KPIs).
- `/src/views/Inventory.tsx`: Listado de stock de almacén simulado.
- `/src/views/Picking.tsx`: Funcionalidad de escáner y preparación de paquetes (Single, Batch, Zona, Wave).
- `/src/views/CRM.tsx`: Base de datos simulada de clientes y status.

## Solución rápida para el problema de "Desmaquetado"

1. Borra tu carpeta `node_modules` y el archivo `package-lock.json`.
2. Actualiza tu `package.json` con el de arriba.
3. Actualiza el `vite.config.ts`.
4. Asegúrate que en `src/main.tsx` (o tu punto de entrada) estés importando `import './index.css';`.
5. Revisa que `src/index.css` tenga `@import "tailwindcss";`.
6. Corre en la terminal: `npm install` seguido de `npm run dev`.
