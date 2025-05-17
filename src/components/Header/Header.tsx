import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Импорт Supabase клиента
import './header.css';

interface HeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
}

export function Header({
  isAuthenticated,
  isAdmin,
  setIsAuthenticated,
  setIsAdmin,
}: HeaderProps) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setIsAdmin(false);
    window.location.href = '/login';
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      setIsAuthenticated(!!user);
      setIsAdmin(user?.email === 'admin@admin.com'); // условие админа
    };

    checkAuth();

    // Обновление при изменении сессии (вход/выход)
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setIsAuthenticated, setIsAdmin]);

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">
          <Link to="/">FOODBAKE</Link>
        </div>

        <ul className={`nav-list ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={toggleMenu}>
              Главная
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/aichat" className={`nav-link ${location.pathname === '/aichat' ? 'active' : ''}`} onClick={toggleMenu}>
              Ai Чат
            </Link>
          </li>
          {isAdmin && (
            <li className="nav-item">
              <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} onClick={toggleMenu}>
                Админ Панель
              </Link>
            </li>
          )}
          <li className="nav-item">
            <Link to="/feed" className={`nav-link ${location.pathname === '/feed' ? 'active' : ''}`} onClick={toggleMenu}>
              Лента
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/wherebuy" className={`nav-link ${location.pathname === '/contacts' ? 'active' : ''}`} onClick={toggleMenu}>
              Где купить
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/aboutUs" className={`nav-link ${location.pathname === '/aboutUs' ? 'active' : ''}`} onClick={toggleMenu}>
              О нас
            </Link>
          </li>

          {/* Мобильные кнопки */}
          <div className="mobile-auth-buttons">
            {!isAuthenticated ? (
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={toggleMenu}>
                  <button className="login-btn">Войти</button>
                </Link>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link" onClick={toggleMenu}>
                    <button className="profile-btn">Профиль</button>
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={() => { handleLogout(); toggleMenu(); }} className="logout-btn nav-link">
                    Выход
                  </button>
                </li>
              </>
            )}
          </div>
        </ul>

        {/* Кнопка мобильного меню */}
        <button className={`mobile-menu-button ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>

        {/* Десктопные кнопки */}
        <div className="desktop-auth-buttons">
          {!isAuthenticated ? (
            <Link to="/login">
              <button className="login-btn">Войти</button>
            </Link>
          ) : (
            <>
              <Link to="/profile">
                <button className="profile-btn">Профиль</button>
              </Link>
              <button onClick={handleLogout} className="logout-btn">Выход</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
