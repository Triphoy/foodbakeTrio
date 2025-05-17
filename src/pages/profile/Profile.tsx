import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './profile.css';

export function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [description, setDescription] = useState('');
  const [savedDescription, setSavedDescription] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverUrl] = useState<string | null>('https://source.unsplash.com/random/1200x300');

  const possibleConditions = [
    'Диабет',
    'Непереносимость лактозы',
    'Целиакия',
    'Аллергия на орехи',
    'Гипертония'
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user || error) {
        navigate('/login');
        return;
      }

      setUserEmail(user.email || '');
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('description, conditions, avatar_url')
        .eq('email', user.email)
        .single();

      if (data && !profileError) {
        setDescription(data.description || '');
        setSavedDescription(data.description || '');
        setConditions(data.conditions || []);
        setAvatarUrl(data.avatar_url || null);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleConditionChange = (condition: string) => {
    setConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          email: userEmail,
          description,
          conditions,
          avatar_url: avatarUrl,
        },
        { onConflict: ['email'] }
      );

    if (!error) {
      setSavedDescription(description);
    } else {
      console.error('Ошибка сохранения профиля:', error.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-card large">
        <div className="avatar-section">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="profile-avatar" />
          ) : (
            <div className="profile-avatar placeholder">
              <i className="fas fa-user"></i>
            </div>
          )}

          <div className="file-upload">
            <label htmlFor="fileInput" className="custom-file-button">
              <i className="fas fa-upload"></i> Загрузить аватар
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </div>
        </div>

        <div className="profile-info">
          <h2>Личный кабинет</h2>
          <p><strong><i className="fas fa-envelope"></i> Email:</strong> {userEmail}</p>
          <p><strong><i className="fas fa-user-shield"></i> Роль:</strong> {isAdmin ? 'Администратор' : 'Пользователь'}</p>

          <div className="profile-description">
            <label>Описание профиля:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Напишите о себе..."
            />
          </div>

          <div className="profile-conditions">
            <label>Ваши состояния / аллергии:</label>
            <div className="dropdown">
              <button
                className="dropdown-toggle"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <i className="fas fa-heartbeat"></i> Выбрать состояния
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  {possibleConditions.map((condition) => (
                    <label key={condition}>
                      <input
                        type="checkbox"
                        checked={conditions.includes(condition)}
                        onChange={() => handleConditionChange(condition)}
                      />{' '}
                      {condition}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="profile-actions">
            <button onClick={handleSave}>
              <i className="fas fa-save"></i> Сохранить
            </button>
            <button className="logout-button" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Выйти
            </button>
          </div>

          {savedDescription && (
            <p className="saved-description">
              Текущее описание: {savedDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
