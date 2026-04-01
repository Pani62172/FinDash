import './EmptyState.css';

export default function EmptyState({ icon = '📭', title = 'No data found', message = 'Try adjusting your filters or add new data.' }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">{message}</p>
    </div>
  );
}
