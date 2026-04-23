import { useState } from 'react';
import axios from '../api/axios';

export default function TagManager({ tags, onTagsChange, dark }) {
  const [newTag, setNewTag] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return setError('Tag name is required');
    try {
      setLoading(true);
      await axios.post('/tags', { name: newTag.trim() });
      setNewTag('');
      setError('');
      onTagsChange();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create tag');
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (id) => {
    if (!editName.trim()) return;
    try {
      await axios.put(`/tags/${id}`, { name: editName.trim() });
      setEditId(null);
      setEditName('');
      onTagsChange();
    } catch (err) {
      setError('Failed to rename tag');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tag? It will be removed from all tasks.')) return;
    try {
      await axios.delete(`/tags/${id}`);
      onTagsChange();
    } catch (err) {
      setError('Failed to delete tag');
    }
  };

  return (
    <div style={{
      ...styles.container,
      backgroundColor: dark ? '#1a1a2e' : '#fff',
      borderColor: dark ? '#2d2d44' : '#e5e7eb'
    }}>
      <h3 style={{
        ...styles.title,
        color: dark ? '#e5e7eb' : '#1a1a1a'
      }}>Manage Tags</h3>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleCreate} style={styles.form}>
        <input
          style={{
            ...styles.input,
            backgroundColor: dark ? '#0f0f1a' : '#fff',
            color: dark ? '#e5e7eb' : '#1a1a1a',
            borderColor: dark ? '#2d2d44' : '#d1d5db'
          }}
          type="text"
          placeholder="New tag name"
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
        />
        <button style={styles.addBtn} disabled={loading}>
          {loading ? 'Adding...' : 'Add Tag'}
        </button>
      </form>

      {tags.length === 0 ? (
        <p style={styles.empty}>No tags yet. Create one above.</p>
      ) : (
        <div style={styles.tagList}>
          {tags.map(tag => (
            <div key={tag._id} style={styles.tagRow}>
              {editId === tag._id ? (
                <>
                  <input
                    style={styles.editInput}
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    autoFocus
                  />
                  <button style={styles.saveBtn} onClick={() => handleRename(tag._id)}>Save</button>
                  <button style={styles.cancelBtn} onClick={() => setEditId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span style={{
                    ...styles.tagName,
                    color: dark ? '#e5e7eb' : '#374151'
                  }}>#{tag.name}</span>
                  <button style={styles.editBtn} onClick={() => {
                    setEditId(tag._id);
                    setEditName(tag.name);
                  }}>Rename</button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(tag._id)}>Delete</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1.25rem',
    marginBottom: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb'
  },
  title: { margin: '0 0 1rem', color: '#1a1a1a', fontSize: '1rem' },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.625rem',
    borderRadius: '6px',
    marginBottom: '0.75rem',
    fontSize: '0.8rem'
  },
  form: { display: 'flex', gap: '0.5rem', marginBottom: '1rem' },
  input: {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    outline: 'none'
  },
  addBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 600
  },
  empty: { color: '#9ca3af', fontSize: '0.875rem' },
  tagList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  tagRow: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  tagName: { flex: 1, color: '#374151', fontSize: '0.875rem' },
  editInput: {
    flex: 1,
    padding: '0.375rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    outline: 'none'
  },
  editBtn: {
    padding: '0.3rem 0.6rem',
    backgroundColor: '#eff6ff',
    color: '#3b82f6',
    border: '1px solid #3b82f6',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.75rem'
  },
  deleteBtn: {
    padding: '0.3rem 0.6rem',
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    border: '1px solid #ef4444',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.75rem'
  },
  saveBtn: {
    padding: '0.3rem 0.6rem',
    backgroundColor: '#ecfdf5',
    color: '#10b981',
    border: '1px solid #10b981',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.75rem'
  },
  cancelBtn: {
    padding: '0.3rem 0.6rem',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.75rem'
  }
};