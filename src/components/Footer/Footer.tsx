import { Link } from 'react-router-dom';
import './Footer.css';

export function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <Link to="/" className="logo">FOODBAKE</Link>
                        <p>Платформа для любителей кулинарии и выпечки</p>
                    </div>

                    <div className="footer-links">
                        <div className="links-column">
                            <h4>Навигация</h4>
                            <ul>
                                <li><Link to="/">Главная</Link></li>
                                <li><Link to="/aichat">AI Чат</Link></li>
                                <li><Link to="/feed">Лента</Link></li>
                                <li><Link to="/contacts">Контакты</Link></li>
                            </ul>
                        </div>

                        <div className="links-column">
                            <h4>Контакты</h4>
                            <ul>
                                <li>Email: info@foodbake.com</li>
                                <li>Телефон: +7 (123) 456-78-90</li>
                                <li>Адрес: Москва, ул. Кулинарная, 15</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} FOODBAKE. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
}