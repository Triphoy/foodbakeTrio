import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHamburger,
  faPlay,
  faArrowDown,
  faBolt,
  faShieldAlt,
  faChartLine,
  faClock,
  faUtensils,
  faFire,
  faLeaf
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import pizzaImage from './img/aipizza.png';
import sushiImage from './img/aisushi.png';
import burgerImage from './img/aiburger.png';
import fastFoodImage from './img/Fastfood.png';
import breakfeastImage from './img/Breakfeast.png';
import veganImage from './img/Vegan.png';
import './home.css';

type TabData = {
  id: string;
  icon: typeof faUtensils;
  title: string;
  description: string;
  image: string;
};

type DishData = {
  id: number;
  title: string;
  shortDesc: string;
  image: string;
  time: string;
  difficulty: string;
  calories: string;
  fullDesc: string;
  ingredients: string[];
};

type FeatureData = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const tabsData: TabData[] = [
  {
    id: 'breakfast',
    icon: faUtensils,
    title: 'Завтраки',
    description: 'Сытные и быстрые идеи для начала дня: от овсянки до яиц Бенедикт.',
    image: breakfeastImage,
  },
  {
    id: 'vegan',
    icon: faLeaf,
    title: 'Веганские блюда',
    description: 'Полноценные рецепты без мяса и молочных продуктов — вкусно и полезно.',
    image: veganImage,
  },
  {
    id: 'fastfood',
    icon: faHamburger,
    title: 'Фастфуд дома',
    description: 'Готовим любимые угощения вроде бургеров и картошки фри прямо на своей кухне.',
    image: fastFoodImage,
  }
];

const dishesData: DishData[] = [
  {
    id: 1,
    title: "Пицца Маргарита",
    shortDesc: "Классическая итальянская пицца",
    image: pizzaImage,
    time: "25 мин",
    difficulty: "Легкая",
    calories: "850 ккал",
    fullDesc: "Тонкое тесто, томатный соус, сыр моцарелла и свежий базилик. Идеальное сочетание простых ингредиентов.",
    ingredients: ["Тесто", "Томаты", "Моцарелла", "Базилик", "Оливковое масло"]
  },
  {
    id: 2,
    title: "Филадельфия ролл",
    shortDesc: "Популярные японские суши",
    image: sushiImage,
    time: "40 мин",
    difficulty: "Средняя",
    calories: "320 ккал",
    fullDesc: "Нори, рис, лосось, сыр филадельфия и огурец. Нежный вкус, который покорил миллионы.",
    ingredients: ["Рис", "Нори", "Лосось", "Сыр филадельфия", "Огурец"]
  },
  {
    id: 3,
    title: "Чизбургер",
    shortDesc: "Американская классика",
    image: burgerImage,
    time: "20 мин",
    difficulty: "Легкая",
    calories: "550 ккал",
    fullDesc: "Говяжья котлета, сыр чеддер, хрустящий салат, маринованные огурчики и специальный соус.",
    ingredients: ["Булочка", "Говядина", "Сыр", "Салат", "Огурцы", "Соус"]
  }
];

const featuresData: FeatureData[] = [
  {
    icon: <FontAwesomeIcon icon={faBolt} />,
    title: 'Умный подбор рецептов',
    description: 'AI анализирует ваши предпочтения и предлагает идеальные варианты.',
  },
  {
    icon: <FontAwesomeIcon icon={faShieldAlt} />,
    title: 'Рецепты из того, что есть',
    description: 'Просто укажите доступные продукты — нейросеть создаст рецепт.',
  },
  {
    icon: <FontAwesomeIcon icon={faChartLine} />,
    title: 'Экономия времени',
    description: 'Больше не тратьте часы на поиск рецептов — AI делает это за секунды.',
  },
];

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabData>(tabsData[0]);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero-container">
        <div>
          <h1>AI знает, что вам приготовить</h1>
          <p>
            Современные технологии встречаются с кулинарным искусством. Доверьте планирование меню нейросети!
          </p>
          <div className="button-container">
            <Link to="/aichat" aria-label="Перейти к AI рецептам">
              <button className="btn">
                <FontAwesomeIcon icon={faPlay} /> AI Рецепт
              </button>
            </Link>
            <Link to="/aboutUs" aria-label="Узнать о FoodBake">
              <button className="btn btn-outline">
                <FontAwesomeIcon icon={faArrowDown} /> Узнать FoodBake
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="second-section-container">
        <div>
          <h2 className="section-title">Наши преимущества</h2>
          <p className="section-subtitle">
            Используем искусственный интеллект, чтобы превратить ваши продукты в кулинарные шедевры.
          </p>
          <div className="features-grid">
            {featuresData.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dishes Section */}
      <section className="dishes-section">
        <div>
          <h2 className="section-title">Топ блюд</h2>
          <p className="section-subtitle">
            Популярные рецепты, отобранные нашим AI
          </p>
          <div className="dishes-grid">
            {dishesData.map((dish) => (
              <article 
                key={dish.id}
                className={`dish-card ${expandedCard === dish.id ? 'expanded' : ''}`}
                onClick={() => toggleCard(dish.id)}
                aria-expanded={expandedCard === dish.id}
              >
                <div 
                  className="dish-image" 
                  style={{ backgroundImage: `url(${dish.image})` }}
                  role="img"
                  aria-label={dish.title}
                />
                <div className="dish-content">
                  <h3>{dish.title}</h3>
                  <p className="dish-short-desc">{dish.shortDesc}</p>
                  <div className="dish-meta">
                    <span><FontAwesomeIcon icon={faClock} /> {dish.time}</span>
                    <span><FontAwesomeIcon icon={faUtensils} /> {dish.difficulty}</span>
                    <span><FontAwesomeIcon icon={faFire} /> {dish.calories}</span>
                  </div>
                  {expandedCard === dish.id && (
                    <div className="dish-details">
                      <p>{dish.fullDesc}</p>
                      <div className="ingredients">
                        <h4>Ингредиенты:</h4>
                        <ul>
                          {dish.ingredients.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Category Section */}
      <section className="dynamic-category-section">
        <div className="background-bubbles" aria-hidden="true" />
        <div>
          <h1>
            <FontAwesomeIcon icon={activeTab.icon} /> {activeTab.title}
          </h1>
          <p>{activeTab.description}</p>
          <div className="navigation-btn-container">
            {tabsData.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${tab.id === activeTab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                aria-current={tab.id === activeTab.id}
              >
                <FontAwesomeIcon icon={tab.icon} /> {tab.title}
              </button>
            ))}
          </div>
        </div>
        <img 
          src={activeTab.image} 
          alt={activeTab.title} 
          loading="lazy"
        />
      </section>
    </div>
  );
};

export default Home;