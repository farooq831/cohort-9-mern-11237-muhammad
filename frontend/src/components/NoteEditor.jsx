import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import PropTypes from 'prop-types';
import EditorToolbar from './EditorToolbar';
import useFocusTrap from '../hooks/useFocusTrap';
import './NoteEditor.css';

const NoteEditor = ({ note, onSave, onCancel, saving }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const isEditMode = Boolean(note);
  const containerRef = useFocusTrap(true);

  const editor = useEditor({
    extensions: [StarterKit],
    content: note?.content || '',
    editable: !saving,
    editorProps: {
      attributes: {
        'aria-label': 'Note content',
        class: 'editor-content-input',
      },
    },
  });

  useEffect(() => {
    setTitle(note?.title || '');
    setError('');
    if (editor) {
      editor.commands.setContent(note?.content || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!saving);
    }
  }, [saving, editor]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (title.trim().length < 1) {
      setError('Give your note a title before saving.');
      return;
    }

    const content = editor ? editor.getHTML() : '';
    onSave({ title: title.trim(), content });
  };

  const wordCount = editor
    ? editor.getText().trim().split(/\s+/).filter(Boolean).length
    : 0;

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

          <EditorToolbar editor={editor} />

          <div className="editor-content-wrapper">
            <EditorContent editor={editor} />
          </div>

          {error && (
            <p className="editor-error" role="alert">
              {error}
            </p>
          )}

          <div className="editor-footer">
            <span className="editor-word-count">{wordCount} words</span>

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