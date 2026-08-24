import PropTypes from 'prop-types';
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
        <span className="note-card-title">{note.title}</span>
        <span className="note-card-preview">
          {note.content ? note.content.slice(0, 140) : 'No content yet.'}
        </span>
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

NoteCard.propTypes = {
  note: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onOpen: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default NoteCard;