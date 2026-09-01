import PropTypes from 'prop-types';
import './EditorToolbar.css';

const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  const buttons = [
    {
      label: 'Bold',
      shortLabel: 'B',
      isActive: () => editor.isActive('bold'),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: 'Italic',
      shortLabel: 'I',
      isActive: () => editor.isActive('italic'),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: 'Heading',
      shortLabel: 'H',
      isActive: () => editor.isActive('heading', { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: 'Bullet list',
      shortLabel: '•',
      isActive: () => editor.isActive('bulletList'),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: 'Numbered list',
      shortLabel: '1.',
      isActive: () => editor.isActive('orderedList'),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: 'Quote',
      shortLabel: '"',
      isActive: () => editor.isActive('blockquote'),
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
    },
  ];

  return (
    <div className="editor-toolbar" role="toolbar" aria-label="Formatting options">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          type="button"
          className={`editor-toolbar-btn ${btn.isActive() ? 'is-active' : ''}`}
          onClick={btn.onClick}
          aria-label={btn.label}
          aria-pressed={btn.isActive()}
          title={btn.label}
        >
          {btn.shortLabel}
        </button>
      ))}
    </div>
  );
};

EditorToolbar.propTypes = {
  editor: PropTypes.object,
};

EditorToolbar.defaultProps = {
  editor: null,
};

export default EditorToolbar;