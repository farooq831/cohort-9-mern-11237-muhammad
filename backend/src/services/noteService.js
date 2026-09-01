const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');
const Note = require('../models/Note');
const AppError = require('../utils/AppError');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// only a small, safe set of formatting tags are allowed through.
// anything else (scripts, iframes, event handlers, etc.) gets stripped,
// even if it was never possible through our own editor UI, because
// notes can also be created directly through the API.
const sanitizeContent = (content) => {
  return sanitizeHtml(content || '', {
    allowedTags: ['p', 'br', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'blockquote'],
    allowedAttributes: {},
  });
};

const MAX_IMPORT_NOTES = 100;

const createNote = async (userId, { title, content }) => {
  try {
    const note = await Note.create({
      user: userId,
      title: title.trim(),
      content: sanitizeContent(content),
    });

    return note;
  } catch (err) {
    throw new AppError('Could not create note, please try again', 500);
  }
};

const getNotes = async (userId) => {
  try {
    return await Note.find({ user: userId, is_deleted: false }).sort({ createdAt: -1 });
  } catch (err) {
    throw new AppError('Could not fetch notes, please try again', 500);
  }
};

const getNoteById = async (userId, noteId) => {
  if (!isValidId(noteId)) {
    throw new AppError('Invalid note id', 400);
  }

  let note;
  try {
    note = await Note.findOne({ _id: noteId, is_deleted: false });
  } catch (err) {
    throw new AppError('Could not fetch note, please try again', 500);
  }

  if (!note) {
    throw new AppError('Note not found', 404);
  }

  if (note.user.toString() !== userId.toString()) {
    throw new AppError('You do not have access to this note', 403);
  }

  return note;
};

const updateNote = async (userId, noteId, { title, content }) => {
  try {
    const note = await getNoteById(userId, noteId);

    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) note.content = sanitizeContent(content);

    await note.save();
    return note;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('Could not update note, please try again', 500);
  }
};

const deleteNote = async (userId, noteId) => {
  try {
    const note = await getNoteById(userId, noteId);

    note.is_deleted = true;
    await note.save();

    return note;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('Could not delete note, please try again', 500);
  }
};

const exportNotes = async (userId) => {
  const notes = await getNotes(userId);
  return notes.map((note) => ({
    title: note.title,
    content: note.content,
  }));
};

const importNotes = async (userId, notesToImport) => {
  if (!Array.isArray(notesToImport)) {
    throw new AppError('Import file must contain a list of notes', 400);
  }

  if (notesToImport.length === 0) {
    throw new AppError('Import file has no notes to import', 400);
  }

  if (notesToImport.length > MAX_IMPORT_NOTES) {
    throw new AppError(`Cannot import more than ${MAX_IMPORT_NOTES} notes at once`, 400);
  }

  const validNotes = [];
  for (const item of notesToImport) {
    const title = typeof item?.title === 'string' ? item.title.trim() : '';
    if (title.length < 1) continue;

    validNotes.push({
      user: userId,
      title,
      content: sanitizeContent(item.content),
    });
  }

  if (validNotes.length === 0) {
    throw new AppError('No valid notes found in the import file', 400);
  }

  try {
    return await Note.insertMany(validNotes);
  } catch (err) {
    throw new AppError('Could not import notes, please try again', 500);
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  exportNotes,
  importNotes,
};