
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';  // Убедитесь, что путь правильный

// Рендерим компонент App в элемент с id="root"
ReactDOM.createRoot(document.getElementById('root')!).render(  // Ожидается элемент с id='root'
  <App />
);
