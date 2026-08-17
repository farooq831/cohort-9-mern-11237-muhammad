import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import EmptyState from '../components/EmptyState';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../services/noteService';
import './DashboardPage.css';

const DashboardPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [editingNote, setEditingNote] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadNotes = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (err) {
      setLoadError('Could not load your notes. Try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const openNewNote = () => {
    setEditingNote(null);
    setEditorOpen(true);
  };

  const openExistingNote = (note) => {
    setEditingNote(note);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingNote(null);
  };

  const handleSave = async ({ title, content }) => {
    setSaving(true);
    try {
      if (editingNote) {
        const updated = await updateNote(editingNote._id, { title, content });
        setNotes((prev) =>
          prev.map((note) => (note._id === updated._id ? updated : note))
        );
      } else {
        const created = await createNote({ title, content });
        setNotes((prev) => [created, ...prev]);
      }
      closeEditor();
    } catch (err) {
      // keep the editor open so the person doesn't lose what they wrote
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!noteToDelete) return;

    setDeleting(true);
    try {
      await deleteNote(noteToDelete._id);
      setNotes((prev) => prev.filter((note) => note._id !== noteToDelete._id));
      setNoteToDelete(null);
    } catch (err) {
      // leave the confirm dialog open so the person can try again
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="dashboard-top">
        <h1 className="dashboard-heading">Your notes</h1>
        {notes.length > 0 && (
          <button className="dashboard-new-note" onClick={openNewNote}>
            New note
          </button>
        )}
      </div>

      {loading && <p className="dashboard-status">Loading your notes…</p>}

      {!loading && loadError && (
        <p className="dashboard-status dashboard-status-error">{loadError}</p>
      )}

      {!loading && !loadError && notes.length === 0 && (
        <EmptyState onNewNote={openNewNote} />
      )}

      {!loading && !loadError && notes.length > 0 && (
        <div className="notes-grid">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onOpen={openExistingNote}
              onDelete={setNoteToDelete}
            />
          ))}
        </div>
      )}

      {editorOpen && (
        <NoteEditor
          note={editingNote}
          onSave={handleSave}
          onCancel={closeEditor}
          saving={saving}
        />
      )}

      {noteToDelete && (
        <ConfirmDeleteModal
          note={noteToDelete}
          onConfirm={handleDelete}
          onCancel={() => setNoteToDelete(null)}
          deleting={deleting}
        />
      )}
    </Layout>
  );
};

export default DashboardPage;