const noteService = require('../services/noteService');
const { validateNoteInput } = require('../utils/validators');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const isValidPayload = (body) => {
  return body && typeof body === 'object' && !Array.isArray(body);
};

const createNote = async (req, res, next) => {
  try {
    const body = req.body || {};

    if (!isValidPayload(body)) {
      throw new AppError('Invalid request payload', 400);
    }

    const errors = validateNoteInput(body);
    if (errors.length > 0) {
      throw new AppError(errors.join(', '), 400);
    }

    const note = await noteService.createNote(req.userId, body);
    logger.info({ userId: req.userId, noteId: note._id }, 'Note created');

    res.status(201).json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

const getNotes = async (req, res, next) => {
  try {
    const notes = await noteService.getNotes(req.userId);
    res.status(200).json({ success: true, data: notes });
  } catch (err) {
    next(err);
  }
};

const getNoteById = async (req, res, next) => {
  try {
    const note = await noteService.getNoteById(req.userId, req.params.id);
    res.status(200).json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const body = req.body || {};

    if (!isValidPayload(body)) {
      throw new AppError('Invalid request payload', 400);
    }

    if (body.title === undefined && body.content === undefined) {
      throw new AppError('Provide at least a title or content to update', 400);
    }

    const errors = validateNoteInput({
      title: body.title !== undefined ? body.title : 'placeholder',
      content: body.content,
    });

    if (body.title !== undefined && errors.includes('Title is required')) {
      throw new AppError('Title is required', 400);
    }

    if (body.content !== undefined && typeof body.content !== 'string') {
      throw new AppError('Content must be a string', 400);
    }

    const note = await noteService.updateNote(req.userId, req.params.id, body);
    logger.info({ userId: req.userId, noteId: note._id }, 'Note updated');

    res.status(200).json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const note = await noteService.deleteNote(req.userId, req.params.id);
    logger.info({ userId: req.userId, noteId: note._id }, 'Note deleted');

    res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createNote, getNotes, getNoteById, updateNote, deleteNote };