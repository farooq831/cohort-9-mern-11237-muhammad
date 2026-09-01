import PropTypes from 'prop-types';
import './NoteCard.css';

const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// content is stored as HTML (from the rich text editor). For the
// card preview we only ever want plain text, so tags are stripped
// here and the result is placed in a <span>, never rendered as HTML.
const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

const NoteCard = ({ note, onOpen, onDelete }) => {
  const previewText = stripHtml(note.content);

  return (
    <article className="note-card">
      <button className="note-card-body" onClick={() => onOpen(note)}>
        <span className="note-card-title">{note.title}</span>
        <span className="note-card-preview">
          {previewText ? previewText.slice(0, 140) : 'No content yet.'}
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