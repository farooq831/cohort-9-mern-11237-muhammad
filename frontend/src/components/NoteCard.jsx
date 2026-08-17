import './NoteCard.css';

const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const NoteCard = ({ note, onOpen, onDelete }) => {
  return (
    <article className="note-card">
      <button className="note-card-body" onClick={() => onOpen(note)}>
        <h3 className="note-card-title">{note.title}</h3>
        <p className="note-card-preview">
          {note.content ? note.content.slice(0, 140) : 'No content yet.'}
        </p>
        <span className="note-card-date">
          Updated {formatDate(note.updatedAt)}
        </span>
      </button>

      <button
        className="note-card-delete"
        onClick={() => onDelete(note)}
        aria-label={`Delete "${note.title}"`}
      >
        Delete
      </button>
    </article>
  );
};

export default NoteCard;