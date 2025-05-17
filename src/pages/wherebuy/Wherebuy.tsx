import { useState, useEffect } from 'react';
import './Wherebuy.css';

interface Ingredient {
  id: number;
  name: string;
}

interface Store {
  id: number;
  name: string;
  type: 'supermarket' | 'market' | 'delivery';
  address: string;
  distance: string;
  price: string;
  open: string;
}

interface DeliveryService {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const Wherebuy = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const deliveryServices: DeliveryService[] = [
    { id: 'yandex', name: 'Яндекс Лавка', description: 'Доставка за 15 минут', icon: 'fab fa-yandex' },
    { id: 'sber', name: 'СберМаркет', description: 'Доставка за 1-2 часа', icon: 'fas fa-ruble-sign' },
    { id: 'ozon', name: 'Ozon Fresh', description: 'Широкий выбор', icon: 'fas fa-bolt' },
    { id: 'dostavista', name: 'Dostavista', description: 'Из любых магазинов', icon: 'fas fa-motorcycle' }
  ];

  useEffect(() => {
    const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;

    if (!apiKey) {
      console.error('Ошибка: отсутствует ключ Yandex Maps API');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
    script.async = true;
    script.onload = () => {
      setMapLoaded(true);
      window.ymaps.ready(() => {
        initMap(55.751244, 37.618423);
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initMap = (lat: number, lng: number) => {
    const map = new window.ymaps.Map('map', {
      center: [lat, lng],
      zoom: 14,
      controls: ['zoomControl', 'fullscreenControl']
    });

    addMockMarkers(map, lat, lng);
    map.controls.add(new window.ymaps.control.GeolocationControl());
  };

  const addMockMarkers = (map: any, lat: number, lng: number) => {
    const mockStores = [
      { name: 'Пятерочка', coords: [lat + 0.002, lng + 0.001], type: 'supermarket', preset: 'islands#redShoppingIcon' },
      { name: 'Магнит', coords: [lat - 0.001, lng + 0.002], type: 'supermarket', preset: 'islands#redShoppingIcon' },
      { name: 'Ашан', coords: [lat + 0.003, lng - 0.002], type: 'supermarket', preset: 'islands#redShoppingIcon' },
      { name: 'Фермерский рынок', coords: [lat - 0.003, lng], type: 'market', preset: 'islands#greenFoodIcon' },
      { name: 'Яндекс Лавка', coords: [lat, lng - 0.003], type: 'delivery', preset: 'islands#darkBlueDeliveryIcon' }
    ];

    mockStores.forEach(store => {
      const marker = new window.ymaps.Placemark(
        store.coords,
        { hintContent: store.name, balloonContent: store.name },
        { preset: store.preset }
      );
      map.geoObjects.add(marker);
    });
  };

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      const newIngredient = { id: Date.now(), name: ingredientInput.trim() };
      setIngredients([...ingredients, newIngredient]);
      setIngredientInput('');

      if (ingredients.length === 0) {
        simulateStoreSearch();
      }
    }
  };

  const removeIngredient = (id: number) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const filterStores = (type: string) => {
    setActiveFilter(type);
  };

  const getLocation = () => {
    setIsLoading(true);
    setStores([]);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (mapLoaded) initMap(lat, lng);

          setTimeout(() => {
            setIsLoading(false);
            loadNearbyStores(lat, lng);
          }, 1500);
        },
        error => {
          setIsLoading(false);
          let message = '';
          switch (error.code) {
            case error.PERMISSION_DENIED: message = 'Доступ к геолокации запрещен.'; break;
            case error.POSITION_UNAVAILABLE: message = 'Информация о местоположении недоступна.'; break;
            case error.TIMEOUT: message = 'Время ожидания истекло.'; break;
            default: message = 'Произошла неизвестная ошибка.';
          }
          alert(message);
        }
      );
    } else {
      alert('Геолокация не поддерживается вашим браузером.');
    }
  };

  const loadNearbyStores = (lat: number, lng: number) => {
    const mockStores: Store[] = [
      { id: 1, name: 'Пятерочка', type: 'supermarket', address: 'ул. Пушкина, 15', distance: '0.3 км', price: 'Низкие цены', open: 'До 23:00' },
      { id: 2, name: 'Магнит', type: 'supermarket', address: 'ул. Лермонтова, 42', distance: '0.5 км', price: 'Средние цены', open: 'Круглосуточно' },
      { id: 3, name: 'Фермерский рынок', type: 'market', address: 'Центральный рынок', distance: '1.2 км', price: 'Свежие продукты', open: 'До 20:00' },
      { id: 4, name: 'Яндекс Лавка', type: 'delivery', address: 'Доставка', distance: '0.1 км', price: 'Быстрая доставка', open: 'Круглосуточно' }
    ];
    setStores(mockStores);
  };

  const simulateStoreSearch = () => {
    setIsLoading(true);
    setStores([]);
    setTimeout(() => {
      setIsLoading(false);
      loadNearbyStores(55.751244, 37.618423); // Moscow
    }, 1000);
  };

  const getStoreTypeName = (type: string) => {
    const types: Record<string, string> = {
      supermarket: 'Супермаркет',
      market: 'Рынок',
      delivery: 'Доставка'
    };
    return types[type] || '';
  };

  const filteredStores = activeFilter === 'all' ? stores : stores.filter(store => store.type === activeFilter);

  return (
    <div>
      <main className="container">
        <section className="search-section">
          <h2><i className="fas fa-search"></i> Добавьте ингредиенты из рецепта</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Например: курица, помидоры, оливковое масло..."
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
            />
            <button onClick={addIngredient}>
              <i className="fas fa-plus"></i> Добавить
            </button>
          </div>
          <div id="ingredients-list">
            {ingredients.map(ingredient => (
              <div key={ingredient.id} className="ingredient-tag">
                <i className="fas fa-carrot"></i> {ingredient.name}
                <button onClick={() => removeIngredient(ingredient.id)} className="remove-ingredient">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="map-stores">
          <div className="map-container">
            <div className="map-overlay" onClick={getLocation}>
              <i className="fas fa-location-arrow"></i> <span>Мое местоположение</span>
            </div>
            <div id="map" style={{ width: '100%', height: '100%' }}></div>
          </div>

          <div className="stores-list">
            <h3><i className="fas fa-store"></i> Магазины рядом</h3>
            <div className="filters">
              <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => filterStores('all')}>
                <i className="fas fa-list"></i> Все
              </button>
              <button className={`filter-btn ${activeFilter === 'supermarket' ? 'active' : ''}`} onClick={() => filterStores('supermarket')}>
                <i className="fas fa-shopping-cart"></i> Супермаркеты
              </button>
              <button className={`filter-btn ${activeFilter === 'market' ? 'active' : ''}`} onClick={() => filterStores('market')}>
                <i className="fas fa-utensils"></i> Рынки
              </button>
              <button className={`filter-btn ${activeFilter === 'delivery' ? 'active' : ''}`} onClick={() => filterStores('delivery')}>
                <i className="fas fa-truck"></i> Доставка
              </button>
            </div>

            {isLoading && (
              <div className="loader">
                <div className="loader-spinner"></div>
                <p>Ищем магазины...</p>
              </div>
            )}

            <div id="stores-container">
              {filteredStores.map(store => (
                <div key={store.id} className="store-item" data-type={store.type}>
                  <div className="store-name">
                    {store.name}
                    <span className="store-type">{getStoreTypeName(store.type)}</span>
                  </div>
                  <div className="store-address">
                    <i className="fas fa-map-marker-alt"></i> {store.address}
                    <span className="store-distance">• {store.distance}</span>
                  </div>
                  <div className="store-price">
                    <i className="fas fa-tag"></i> {store.price} • {store.open}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="delivery-section">
          <h2><i className="fas fa-truck-fast"></i> Заказать с доставкой</h2>
          <div className="delivery-grid">
            {deliveryServices.map(service => (
              <div key={service.id} className="delivery-card">
                <div className="delivery-logo"><i className={service.icon}></i></div>
                <h4>{service.name}</h4>
                <p>{service.description}</p>
                <button className="delivery-btn">Заказать</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Wherebuy;
