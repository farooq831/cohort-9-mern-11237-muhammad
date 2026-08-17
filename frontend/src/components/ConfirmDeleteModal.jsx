import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ note, onConfirm, onCancel, deleting }) => {
  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true">
      <div className="confirm-panel">
        <h3 className="confirm-title">Delete this note?</h3>
        <p className="confirm-message">
          "{note.title}" will be removed. This can't be undone.
        </p>

        <div className="confirm-actions">
          <button
            className="confirm-cancel"
            onClick={onCancel}
            disabled={deleting}
          >
            Keep note
          </button>
          <button
            className="confirm-delete"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : 'Delete note'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;