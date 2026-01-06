import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { loadRuntimeConfig } from './config/api'

// Load runtime config before rendering app
loadRuntimeConfig().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
