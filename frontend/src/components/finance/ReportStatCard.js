import React from 'react';

function ReportStatCard({ label, value, tone = 'neutral', detail }) {
  return (
    <article className={`report-stat-card report-stat-${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      {detail && <span>{detail}</span>}
    </article>
  );
}

export default ReportStatCard;
