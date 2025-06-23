import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'react-toastify/dist/ReactToastify.css'; // ✅ Toastify CSS for showing notfication on frotnend
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
