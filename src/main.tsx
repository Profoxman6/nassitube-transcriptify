import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Clear any existing root element content
const rootElement = document.getElementById("root")!;
if (rootElement.hasChildNodes()) {
  rootElement.innerHTML = '';
}

// Create new root and render app
createRoot(rootElement).render(<App />);