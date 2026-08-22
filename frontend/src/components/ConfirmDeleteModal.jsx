import PropTypes from 'prop-types';
import useFocusTrap from '../hooks/useFocusTrap';
import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ note, onConfirm, onCancel, deleting }) => {
  const containerRef = useFocusTrap(true);

  return (
    <div className="confirm-overlay">
      <div
        className="confirm-panel"
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <h3 className="confirm-title" id="confirm-title">
          Delete this note?
        </h3>
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

ConfirmDeleteModal.propTypes = {
  note: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  deleting: PropTypes.bool,
};

ConfirmDeleteModal.defaultProps = {
  deleting: false,
};

export default ConfirmDeleteModal;