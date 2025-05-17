import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot, faPaperPlane, faLock } from '@fortawesome/free-solid-svg-icons';
import './AiChat.css';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';


interface Message {
  text: string;
  isUser: boolean;
}

interface HistoryItem {
  text: string;
  timestamp: string;
  isUser: boolean;
}

interface Post {
  id: number;
  title: string;
  description: string;
  image: string;
  likes: number;
  comments: any[];
  createdAt: string;
}

export function AiChat() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [conditions, setConditions] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Привет! Я твой кулинарный помощник. Чем могу помочь?', isUser: false },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [requestCount, setRequestCount] = useState(0);
  const navigate = useNavigate();

  const API_TOKEN = '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';
  const MODEL_NAME = 'openai/gpt-4o-mini';
  const MAX_GUEST_REQUESTS = 1;

  // Проверка авторизации через Supabase
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      if (user) {
        const conditionsData = JSON.parse(localStorage.getItem('userConditions') || '{}');
        setConditions(conditionsData);
      }
    };

    checkAuth();

    try {
      const saved = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      const safeData = saved.filter((item: HistoryItem) => item && item.text && typeof item.text === 'string');
      setHistory(safeData);
    } catch {
      localStorage.removeItem('chatHistory');
    }
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async () => {
    if (!isAuthenticated && requestCount >= MAX_GUEST_REQUESTS) {
      setMessages(prev => [...prev, { text: 'Для продолжения общения необходимо авторизоваться', isUser: false }]);
      return;
    }

    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { text: trimmed, isUser: true };
    setMessages(prev => [...prev, userMessage]);

    setInputValue('');
    setIsLoading(true);
    setRequestCount(prev => prev + 1);

    const healthNotes = conditions.length > 0
      ? ` У пользователя есть ограничения: ${conditions.join(', ')}. Учитывай это в ответе.`
      : '';

    const prompt = `${trimmed}${healthNotes}\n\nПожалуйста, дай краткий и понятный кулинарный ответ без форматирования.`;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            {
              role: 'system',
              content: 'Ты — кулинарный ассистент. Отвечай кратко, без Markdown и только по теме кулинарии. Учитывай диеты, если пользователь указал болезни или аллергии.',
            },
            ...messages.map(m => ({
              role: m.isUser ? 'user' : 'assistant',
              content: m.text,
            })),
            { role: 'user', content: prompt },
          ],
        }),
      });

      const data = await response.json();
      const aiText = data.choices?.[0]?.message?.content?.replace(/[#*`]/g, '') || 'Нет ответа';
      setMessages(prev => [...prev, { text: aiText, isUser: false }]);

      if (isAuthenticated) {
        const newEntry: HistoryItem = {
          text: trimmed,
          timestamp: new Date().toISOString(),
          isUser: true,
        };
        const updatedHistory = [newEntry, ...history].slice(0, 50); // лимит 50
        setHistory(updatedHistory);
        localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
      }
    } catch {
      setMessages(prev => [...prev, { text: 'Ошибка запроса. Попробуйте позже.', isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Очистить всю историю?')) {
      localStorage.removeItem('chatHistory');
      setHistory([]);
      setMessages([
        { text: 'История очищена. Чем могу помочь?', isUser: false },
      ]);
    }
  };

  const handlePublish = (text: string) => {
    if (!isAuthenticated) {
      alert('Для публикации необходимо авторизоваться');
      return;
    }

    const title = text.split('\n')[0].slice(0, 100).trim();
    const description = text.trim();
    const newPost: Post = {
      id: Date.now(),
      title: title || 'Рецепт от ассистента',
      description,
      image: 'https://via.placeholder.com/400x250?text=AI+Recipe',
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    const updatedPosts = [newPost, ...existingPosts];
    localStorage.setItem('posts', JSON.stringify(updatedPosts));

    alert('Рецепт опубликован в ленте!');
  };

  const handleAuthRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="chat-container">
      {!isAuthenticated && (
        <div className="auth-notice">
          <FontAwesomeIcon icon={faLock} />
          <span>У вас есть {MAX_GUEST_REQUESTS - requestCount} бесплатных запросов</span>
          <button onClick={handleAuthRedirect}>Войти</button>
        </div>
      )}

      <div className="history-panel">
        <h4>История {!isAuthenticated && '(только сессия)'}</h4>
        {isAuthenticated && history.length > 0 && (
          <button className="clear-btn" onClick={handleClearHistory}>Очистить</button>
        )}
        {history.length === 0 && <div className="empty-history">Пока нет запросов</div>}
        {history.map((item, idx) => (
          <div key={idx} className="history-item" onClick={() => setInputValue(item.text)}>
            <span>{(item.text || '').slice(0, 20)}...</span>
            <span className="history-time">{formatTime(item.timestamp)}</span>
          </div>
        ))}
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.isUser ? 'user' : 'ai'}`}>
            <div className="content">
              <div className="icon-inside">
                <FontAwesomeIcon icon={msg.isUser ? faUser : faRobot} />
              </div>
              <div className="text">{msg.text}</div>
              {!msg.isUser && idx !== 0 && isAuthenticated && (
                <button className="publish-btn" onClick={() => handlePublish(msg.text)}>
                  Опубликовать
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message ai">
            <div className="content">
              <div className="icon-inside">
                <FontAwesomeIcon icon={faRobot} />
              </div>
              <div className="text">Думаю...</div>
            </div>
          </div>
        )}
        <div className="chat-input">
          <input
            type="text"
            placeholder={
              !isAuthenticated && requestCount >= MAX_GUEST_REQUESTS
                ? 'Авторизуйтесь для продолжения'
                : 'Введите кулинарный вопрос...'
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading || (!isAuthenticated && requestCount >= MAX_GUEST_REQUESTS)}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || (!isAuthenticated && requestCount >= MAX_GUEST_REQUESTS)}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
}
