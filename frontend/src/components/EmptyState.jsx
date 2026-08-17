import './EmptyState.css';

const EmptyState = ({ onNewNote }) => {
  return (
    <div className="empty-state">
      <h2 className="empty-state-title">No notes yet</h2>
      <p className="empty-state-sub">
        Write down something worth remembering.
      </p>
      <button className="empty-state-cta" onClick={onNewNote}>
        Write your first note
      </button>
    </div>
  );
};

export default EmptyState;