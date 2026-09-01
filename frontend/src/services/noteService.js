import api from './api';

export const fetchNotes = async () => {
  const res = await api.get('/notes');
  return res.data.data;
};

export const createNote = async ({ title, content }) => {
  const res = await api.post('/notes', { title, content });
  return res.data.data;
};

export const updateNote = async (id, { title, content }) => {
  const res = await api.put(`/notes/${id}`, { title, content });
  return res.data.data;
};

export const deleteNote = async (id) => {
  await api.delete(`/notes/${id}`);
};

export const exportNotes = async () => {
  const res = await api.get('/notes/export');
  return res.data.data;
};

export const importNotes = async (notes) => {
  const res = await api.post('/notes/import', { notes });
  return res.data.data;
};