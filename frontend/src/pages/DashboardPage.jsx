import { useEffect, useRef, useState } from 'react';
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
  exportNotes,
  importNotes,
} from '../services/noteService';
import './DashboardPage.css';

const DashboardPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [editingNote, setEditingNote] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [importError, setImportError] = useState('');
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

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
    setSaveError('');
    setEditorOpen(true);
  };

  const openExistingNote = (note) => {
    setEditingNote(note);
    setSaveError('');
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingNote(null);
    setSaveError('');
  };

  const handleSave = async ({ title, content }) => {
    setSaving(true);
    setSaveError('');
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
      setSaveError('Could not save this note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const closeDeleteConfirm = () => {
    setNoteToDelete(null);
    setDeleteError('');
  };

  const handleDelete = async () => {
    if (!noteToDelete) return;

    setDeleting(true);
    setDeleteError('');
    try {
      await deleteNote(noteToDelete._id);
      setNotes((prev) => prev.filter((note) => note._id !== noteToDelete._id));
      closeDeleteConfirm();
    } catch (err) {
      setDeleteError('Could not delete this note. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportNotes();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'my-notes-export.json';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setImportError('Could not export notes. Please try again.');
    }
  };

  const handleImportClick = () => {
    setImportError('');
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setImporting(true);
    setImportError('');
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const importedNotes = await importNotes(parsed);
      setNotes((prev) => [...importedNotes, ...prev]);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setImportError('That file is not valid JSON.');
      } else {
        setImportError(
          err.response?.data?.message || 'Could not import that file.'
        );
      }
    } finally {
      setImporting(false);
    }
  };

  return (
    <Layout>
      <div className="dashboard-top">
        <h1 className="dashboard-heading">Your notes</h1>
        <div className="dashboard-actions">
          {notes.length > 0 && (
            <button className="dashboard-secondary-btn" onClick={handleExport}>
              Export
            </button>
          )}
          <button
            className="dashboard-secondary-btn"
            onClick={handleImportClick}
            disabled={importing}
          >
            {importing ? 'Importing…' : 'Import'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="sr-only-input"
            onChange={handleFileSelected}
          />
          {notes.length > 0 && (
            <button className="dashboard-new-note" onClick={openNewNote}>
              New note
            </button>
          )}
        </div>
      </div>

      {importError && (
        <p className="dashboard-status dashboard-status-error" role="alert">
          {importError}
        </p>
      )}

      {loading && <p className="dashboard-status">Loading your notes…</p>}

      {!loading && loadError && (
        <p className="dashboard-status dashboard-status-error" role="alert">
          {loadError}
        </p>
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

      {deleteError && (
        <p className="dashboard-status dashboard-status-error" role="alert">
          {deleteError}
        </p>
      )}

      {editorOpen && (
        <>
          {saveError && (
            <p className="dashboard-status dashboard-status-error" role="alert">
              {saveError}
            </p>
          )}
          <NoteEditor
            note={editingNote}
            onSave={handleSave}
            onCancel={closeEditor}
            saving={saving}
          />
        </>
      )}

      {noteToDelete && (
        <ConfirmDeleteModal
          note={noteToDelete}
          onConfirm={handleDelete}
          onCancel={closeDeleteConfirm}
          deleting={deleting}
        />
      )}
    </Layout>
  );
};

export default DashboardPage;