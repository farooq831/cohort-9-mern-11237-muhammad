const mongoose = require('mongoose');
const Note = require('../models/Note');
const AppError = require('../utils/AppError');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const createNote = async (userId, { title, content }) => {
  try {
    const note = await Note.create({
      user: userId,
      title: title.trim(),
      content: content || '',
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
    if (content !== undefined) note.content = content;

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

module.exports = { createNote, getNotes, getNoteById, updateNote, deleteNote };