import React, { useEffect } from 'react';
import { FaBrain, FaClock, FaUserCog } from 'react-icons/fa';
import ScrollReveal from 'scrollreveal';
import './AboutUs.css';

// Импорт изображений
import member1 from './img/timoha.jpg';
import member2 from './img/kirill.jpg';
import member3 from './img/dima.jpg';

const AboutUs: React.FC = () => {
  useEffect(() => {
    const scrollReveal = ScrollReveal({
      reset: true,
      distance: '60px',
      duration: 1000,
      delay: 200
    });

    scrollReveal.reveal('.section-title', { origin: 'bottom' });
    scrollReveal.reveal('.about p', { origin: 'left', interval: 200 });
    scrollReveal.reveal('.member', { origin: 'bottom', interval: 200 });

    return () => {
      scrollReveal.destroy();
    };
  }, []);

  return (
    <div className="about-page">
      <div className="container">
        <section id="about" className="about">
          <h2 className="section-title">О нас</h2>
          <p><strong>Добро пожаловать в FoodBake</strong> – инновационную компанию, которая меняет представление о приготовлении пищи!</p>
          <p><strong>Как работает FoodBake?</strong><br />Наш ИИ анализирует тысячи рецептов, ингредиентов и методов приготовления.</p>
          <p><strong>Лента рецептов FoodBake:</strong> Вы сможете получать индивидуальные рекомендации.</p>
          
          <div className="features">
            <div className="feature-item">
              <FaBrain className="feature-icon" />
              <span>Умные рецепты</span>
            </div>
            <div className="feature-item">
              <FaUserCog className="feature-icon" />
              <span>Индивидуальные рекомендации</span>
            </div>
            <div className="feature-item">
              <FaClock className="feature-icon" />
              <span>Экономия времени</span>
            </div>
          </div>
        </section>

        <section id="team">
          <h2 className="section-title">Наша команда</h2>
          <div className="team">
            <div className="member">
              <img src={member3} alt="Матвеев Дмитрий" />
              <h3>Матвеев Дмитрий</h3>
              <p>Дмитриевич<br />Разработчик</p>
            </div>
            <div className="member">
              <img src={member2} alt="Сычев Кирилл" />
              <h3>Сычев Кирилл</h3>
              <p>Романович<br />Разработчик</p>
            </div>
            <div className="member">
              <img src={member1} alt="Гаус Тимофей" />
              <h3>Гаус Тимофей</h3>
              <p>Максимович<br />Разработчик</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;