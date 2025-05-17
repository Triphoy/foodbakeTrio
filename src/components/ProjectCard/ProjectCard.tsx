import { Link } from 'react-router-dom';

type ProjectCardProps = {
  id: string;
  title: string;
  description: string;
  image: string;
  isCompact?: boolean; // Для разного отображения в Home/Portfolio
};

export function ProjectCard({ id, title, description, image, isCompact = false }: ProjectCardProps) {
  return (
    <div className={`project-card ${isCompact ? 'compact' : ''}`}>
      <img src={image} alt={title} className="project-image" />
      <div className="project-content">
        <h3>{title}</h3>
        <p>{description}</p>
        {isCompact ? (
          <Link to={`/portfolio#${id}`} className="project-link">
            Подробнее →
          </Link>
        ) : (
          <button className="project-button">Заказать аналогичный</button>
        )}
      </div>
    </div>
  );
}