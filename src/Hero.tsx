import { useState } from 'react';
import './hero.css';

export function Hero() {
  // Состояния для табов
  const [activeTab, setActiveTab] = useState('home');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) {
      setError('Name is required');
    } else {
      setError('');
      alert(`Hello, ${name}!`);
    }
  };

  // Контент для каждой вкладки
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div>
            <h2>Welcome to the Home Tab!</h2>
            <p>This is the main content of your page.</p>
          </div>
        );
      case 'blog':
        return (
          <div>
            <h2>Blog Posts</h2>
            <p>Here will be your blog articles.</p>
          </div>
        );
      case 'price':
        return (
          <div>
            <h2>Pricing Plans</h2>
            <p>Check out our offers!</p>
          </div>
        );
      case 'contacts':
        return (
          <div>
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {error && <p className="error">{error}</p>}
              <button type="submit">Submit</button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="hero">
      <h1>MY PAGE</h1>
      
      {/* Табы (вкладки) */}
      <div className="tabs">
        <button 
          className={activeTab === 'home' ? 'active' : ''} 
          onClick={() => setActiveTab('home')}
        >
          Home
        </button>
        <button 
          className={activeTab === 'blog' ? 'active' : ''} 
          onClick={() => setActiveTab('blog')}
        >
          Blog
        </button>
        <button 
          className={activeTab === 'price' ? 'active' : ''} 
          onClick={() => setActiveTab('price')}
        >
          Price
        </button>
        <button 
          className={activeTab === 'contacts' ? 'active' : ''} 
          onClick={() => setActiveTab('contacts')}
        >
          Contacts
        </button>
      </div>

      {/* Контент таба */}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}
