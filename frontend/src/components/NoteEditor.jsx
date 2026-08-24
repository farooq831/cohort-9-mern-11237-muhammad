import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useFocusTrap from '../hooks/useFocusTrap';
import './NoteEditor.css';

const NoteEditor = ({ note, onSave, onCancel, saving }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const isEditMode = Boolean(note);
  const containerRef = useFocusTrap(true);

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setError('');
  }, [note]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (title.trim().length < 1) {
      setError('Give your note a title before saving.');
      return;
    }

    onSave({ title: title.trim(), content });
  };

  return (
    <div className="editor-overlay">
      <div
        className="editor-panel"
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-heading"
      >
        <div className="editor-panel-rule" aria-hidden="true" />

        <form className="editor-form" onSubmit={handleSubmit}>
          <span className="editor-eyebrow" id="editor-heading">
            {isEditMode ? 'Edit note' : 'New note'}
          </span>

          <label className="sr-only" htmlFor="note-title">
            Note title
          </label>
          <input
            id="note-title"
            className="editor-title-input"
            type="text"
            placeholder="Untitled"
            aria-label="Note title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={saving}
            autoFocus
          />

          <label className="sr-only" htmlFor="note-content">
            Note content
          </label>
          <textarea
            id="note-content"
            className="editor-content-input"
            placeholder="Start writing…"
            aria-label="Note content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={saving}
            rows={12}
          />

          {error && (
            <p className="editor-error" role="alert">
              {error}
            </p>
          )}

          <div className="editor-footer">
            <span className="editor-word-count">
              {content.trim() ? content.trim().split(/\s+/).length : 0} words
            </span>

            <div className="editor-actions">
              <button
                type="button"
                className="editor-cancel"
                onClick={onCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="editor-save" disabled={saving}>
                {saving ? 'Saving…' : 'Save note'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

NoteEditor.propTypes = {
  note: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};

NoteEditor.defaultProps = {
  note: null,
  saving: false,
};

export default NoteEditor;