const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  exportNotes,
  importNotes,
} = require('../controllers/noteController');

// every note route requires a logged-in user
router.use(protect);

// these two must be declared BEFORE the /:id routes below —
// otherwise Express would treat "export"/"import" as a note id
router.get('/export', exportNotes);
router.post('/import', importNotes);

router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;