import { useEffect, useState } from 'react';
import './feed.css';
import { supabase } from '../../supabaseClient'; // подключение Supabase

type Post = {
  id: number;
  title: string;
  description: string;
  image: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
  authorEmail: string; // Добавляем email автора поста
};

type Comment = {
  id: number;
  author: string;
  text: string;
  createdAt: string;
};

export function Feed() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [activePost, setActivePost] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user data:', error);
        setIsAuthenticated(false);
        return;
      }

      if (user) {
        setIsAuthenticated(true);
        const email = user.email || '';
        setIsAdmin(email === 'admin@admin.com'); // Проверяем, является ли пользователь администратором
      } else {
        setIsAuthenticated(false);
      }
    };

    fetchUserData();

    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) setPosts(JSON.parse(savedPosts));

    const liked = localStorage.getItem('likedPosts');
    if (liked) setLikedPosts(JSON.parse(liked));
  }, []);

  // Фильтрация и сортировка постов
  const filteredPosts = posts
    .filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return b.likes - a.likes;
      }
    });

  const handleLike = (id: number) => {
    if (!isAuthenticated) {
      setError('Войдите, чтобы ставить лайки');
      return;
    }

    const alreadyLiked = likedPosts.includes(id);

    setPosts(prev =>
      prev.map(post =>
        post.id === id
          ? { ...post, likes: post.likes + (alreadyLiked ? -1 : 1) }
          : post
      )
    );

    setLikedPosts(prev =>
      alreadyLiked ? prev.filter(likedId => likedId !== id) : [...prev, id]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Размер файла должен быть меньше 5MB');
        return;
      }
      if (!file.type.match('image.*')) {
        setError('Пожалуйста, загрузите изображение');
        return;
      }
      setImageFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!imageFile || !title || !description) {
      setError('Заполните все поля и выберите изображение');
      return;
    }

    if (!isAuthenticated) {
      setError('Вы должны быть авторизованы для публикации');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', title);
    formData.append('description', description);

    try {
      setLoading(true);
      // Имитация загрузки на сервер
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Получаем данные о текущем пользователе
      const { data: user } = await supabase.auth.getUser();
      const newPost: Post = {
        id: Date.now(),
        title,
        description,
        image: URL.createObjectURL(imageFile), // В реальном приложении используйте URL с сервера
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString(),
        authorEmail: user?.email || 'unknown@example.com', // Получаем email пользователя из Supabase
      };

      setPosts([newPost, ...posts]);
      setTitle('');
      setDescription('');
      setImageFile(null);
      setShowForm(false);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Не удалось загрузить пост');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin) return; // Проверка на админа
  
    try {
      // Удаляем пост из базы данных
      const { error } = await supabase
        .from('posts') // Убедитесь, что у вас есть таблица с таким названием в Supabase
        .delete()
        .eq('id', id);
  
      if (error) {
        console.error('Ошибка удаления поста:', error.message);
        setError('Не удалось удалить пост');
        return;
      }
  
      // После успешного удаления из базы данных, обновляем состояние
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
    } catch (err) {
      console.error('Ошибка при удалении поста:', err);
      setError('Не удалось удалить пост');
    }
  };
  

  const toggleComments = (id: number) => {
    setActivePost(activePost === id ? null : id);
  };

  const handleAddComment = (postId: number) => {
    if (!commentText.trim()) return;

    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Date.now(),
                  author: 'Вы',
                  text: commentText,
                  createdAt: new Date().toISOString()
                }
              ]
            }
          : post
      )
    );
    setCommentText('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="feed-container">
      <h1 className="feed-title">🍽 Лента блюд</h1>

      <div className="feed-controls">
        <div className="search-sort">
          <input
            type="text"
            placeholder="Поиск по ленте..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular')}
            className="sort-select"
          >
            <option value="newest">Сначала новые</option>
            <option value="popular">По популярности</option>
          </select>
        </div>

        {isAuthenticated && (
          <button className="floating-button" onClick={() => setShowForm(!showForm)}>
            <i className="fas fa-plus"></i>
            <span>{showForm ? 'Отмена' : 'Новый пост'}</span>
          </button>
        )}
      </div>

      {showForm && (
        <form className="post-form slide-down" onSubmit={handleSubmit}>
          <h3>Создать новый пост</h3>
          <input
            type="text"
            placeholder="Название блюда"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Описание блюда, рецепт, ингредиенты..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="file-upload">
            <label>
              <i className="fas fa-image upload-icon"></i>
              {imageFile ? imageFile.name : 'Выберите изображение'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                required
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Загрузка...
              </>
            ) : (
              'Опубликовать'
            )}
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
      )}

      {!isAuthenticated && (
        <div className="auth-message">
          <i className="fas fa-info-circle"></i> Войдите, чтобы публиковать посты и ставить лайки
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="empty-feed">
          <i className="fas fa-utensils"></i>
          <p>Пока нет постов. Будьте первым!</p>
        </div>
      ) : (
        <div className="post-list">
          {filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-author">
                  <i className="fas fa-user-circle"></i>
                  <span>{post.authorEmail}</span>
                </div>
                <div className="post-date">
                  {formatDate(post.createdAt)}
                </div>
              </div>
              <div className="post-body">
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <img src={post.image} alt={post.title} className="post-image" />
              </div>
              <div className="post-footer">
                <button className="like-button" onClick={() => handleLike(post.id)}>
                  <i className={`fas fa-heart ${likedPosts.includes(post.id) ? 'liked' : ''}`}></i>
                  {post.likes} Лайков
                </button>
                <button className="comment-button" onClick={() => toggleComments(post.id)}>
                  Комментарии
                </button>
                {isAdmin && (
  <button className="delete-button" onClick={() => handleDelete(post.id)}>
    Удалить
  </button>
)}

              </div>

              {activePost === post.id && (
                <div className="comments-section">
                  <div className="comment-list">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="comment">
                        <div className="comment-author">{comment.author}</div>
                        <div className="comment-text">{comment.text}</div>
                        <div className="comment-date">
                          {formatDate(comment.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="comment-input">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Ваш комментарий"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="add-comment-button"
                    >
                      Добавить
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
