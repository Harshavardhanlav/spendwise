import React from 'react';

function Card({ children, className = '', muted = false }) {
  return <section className={`surface-card${muted ? ' surface-card-muted' : ''} ${className}`}>{children}</section>;
}

export function CardHeader({ title, description, action }) {
  return (
    <div className="card-header">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`card-body ${className}`}>{children}</div>;
}

export default Card;
