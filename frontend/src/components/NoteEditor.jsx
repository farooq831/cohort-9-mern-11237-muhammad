import { useEffect, useState } from 'react';
import './NoteEditor.css';

const NoteEditor = ({ note, onSave, onCancel, saving }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const isEditMode = Boolean(note);

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
    <div className="editor-overlay" role="dialog" aria-modal="true">
      <div className="editor-panel">
        <div className="editor-panel-rule" aria-hidden="true" />

        <form className="editor-form" onSubmit={handleSubmit}>
          <span className="editor-eyebrow">
            {isEditMode ? 'Edit note' : 'New note'}
          </span>

          <input
            className="editor-title-input"
            type="text"
            placeholder="Untitled"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
          />

          <textarea
            className="editor-content-input"
            placeholder="Start writing…"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={12}
          />

          {error && <p className="editor-error">{error}</p>}

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

export default NoteEditor;