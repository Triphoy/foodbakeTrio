import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { supabase } from '../../supabaseClient';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'FoodBake_bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '10');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-lang', 'ru');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;

    document.getElementById('telegram-button')?.appendChild(script);

    (window as any).onTelegramAuth = (user: any) => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('telegramUser', JSON.stringify(user));
      navigate('/');
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      const { error } = await supabase.auth.signUp({
        email: username,
        password: password,
      });
      if (error) {
        setError(error.message);
      } else {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', username);
        if (username === 'dima20eastern09@gmail.com') {
          localStorage.setItem('isAdmin', 'true');
        } else {
          localStorage.removeItem('isAdmin');
        }
        navigate('/');
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (error || !data.session) {
        setError('Неверный логин или пароль');
      } else {
        const userEmail = data.session.user.email;
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', userEmail);
        if (userEmail === 'dima20eastern09@gmail.com') {
          localStorage.setItem('isAdmin', 'true');
        } else {
          localStorage.removeItem('isAdmin');
        }
        navigate('/');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? 'Регистрация' : 'Вход администратора'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Почта"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isRegistering ? 'Зарегистрироваться' : 'Войти'}</button>
      </form>

      {error && <p className="error">{error}</p>}

      <p style={{ marginTop: '20px' }}>
        {isRegistering ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
        <button
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError('');
          }}
          style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
        >
          {isRegistering ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </p>

      <hr style={{ margin: '30px 0' }} />
      <h3>Или войдите через Telegram</h3>
      <div id="telegram-button"></div>
    </div>
  );
}
