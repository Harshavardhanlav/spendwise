import React from 'react';
import Card, { CardBody } from '../components/ui/Card';

function PlaceholderPage({ eyebrow, title, description, icon: Icon }) {
  return (
    <div className="page-placeholder">
      <div className="page-intro">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <Card muted>
        <CardBody>
          <div className="placeholder-content">
            {Icon && <Icon size={22} aria-hidden="true" />}
            <div>
              <h3>Workspace ready</h3>
              <p>This area is prepared for the next SpendWise feature phase.</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default PlaceholderPage;
