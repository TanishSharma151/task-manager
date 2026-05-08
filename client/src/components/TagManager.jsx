import { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function TagManager({ tags, onTagsChange, dark }) {
  const [newTag, setNewTag] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!newTag.trim()) {
      return setError('Tag name is required');
    }

    try {
      setLoading(true);

      await axios.post('/tags', {
        name: newTag.trim(),
      });

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
      await axios.put(`/tags/${id}`, {
        name: editName.trim(),
      });

      setEditId(null);
      setEditName('');

      onTagsChange();
    } catch (err) {
      setError('Failed to rename tag');
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        'Delete this tag? It will be removed from all tasks.'
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      await axios.delete(`/tags/${id}`);

      onTagsChange();
    } catch (err) {
      setError('Failed to delete tag');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: dark ? '#1a1a2e' : '#fff',
        borderColor: dark ? '#2d2d44' : '#e5e7eb',
      }}
    >
      <h3
        style={{
          ...styles.title,
          color: dark ? '#e5e7eb' : '#1a1a1a',
        }}
      >
        Manage Tags
      </h3>

      {error && <div style={styles.error}>{error}</div>}

      <form
        onSubmit={handleCreate}
        style={{
          ...styles.form,
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        <input
          style={{
            ...styles.input,
            backgroundColor: dark ? '#0f0f1a' : '#fff',
            color: dark ? '#e5e7eb' : '#1a1a1a',
            borderColor: dark ? '#2d2d44' : '#d1d5db',
          }}
          type="text"
          placeholder="New tag name"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />

        <button
          style={{
            ...styles.addBtn,
            width: isMobile ? '100%' : 'auto',
          }}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Tag'}
        </button>
      </form>

      {tags.length === 0 ? (
        <p style={styles.empty}>
          No tags yet. Create one above.
        </p>
      ) : (
        <div style={styles.tagList}>
          {tags.map((tag) => (
            <div
              key={tag._id}
              style={{
                ...styles.tagRow,
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                justifyContent: 'space-between',
              }}
            >
              {editId === tag._id ? (
                <>
                  <input
                    style={{
                      ...styles.editInput,
                      width: isMobile ? '100%' : 'auto',
                    }}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                  />

                  <div
                    style={{
                      ...styles.btnGroup,
                      width: isMobile ? '100%' : 'auto',
                      justifyContent: isMobile
                        ? 'flex-start'
                        : 'flex-end',
                    }}
                  >
                    <button
                      style={styles.saveBtn}
                      onClick={() => handleRename(tag._id)}
                    >
                      Save
                    </button>

                    <button
                      style={styles.cancelBtn}
                      onClick={() => {
                        setEditId(null);
                        setEditName('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span
                    style={{
                      ...styles.tagName,
                      color: dark ? '#e5e7eb' : '#374151',
                    }}
                  >
                    #{tag.name}
                  </span>

                  <div
                    style={{
                      ...styles.btnGroup,
                      width: isMobile ? '100%' : 'auto',
                      justifyContent: isMobile
                        ? 'flex-start'
                        : 'flex-end',
                    }}
                  >
                    <button
                      style={styles.editBtn}
                      onClick={() => {
                        setEditId(tag._id);
                        setEditName(tag.name);
                      }}
                    >
                      Rename
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(tag._id)}
                    >
                      Delete
                    </button>
                  </div>
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
    borderRadius: '16px',
    padding: '1.25rem',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    border: '1px solid',
  },

  title: {
    margin: '0 0 1rem',
    fontSize: '1.1rem',
    fontWeight: 700,
  },

  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.85rem',
  },

  form: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.25rem',
  },

  input: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid',
    borderRadius: '10px',
    fontSize: '0.9rem',
    outline: 'none',
  },

  addBtn: {
    padding: '0.75rem 1rem',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 700,
  },

  empty: {
    color: '#9ca3af',
    fontSize: '0.9rem',
  },

  tagList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  },

  tagRow: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1rem',
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  tagName: {
    fontSize: '0.95rem',
    fontWeight: 600,
    wordBreak: 'break-word',
  },

  btnGroup: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },

  editInput: {
    flex: 1,
    padding: '0.6rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.9rem',
    outline: 'none',
  },

  editBtn: {
    padding: '0.45rem 0.75rem',
    backgroundColor: '#eff6ff',
    color: '#3b82f6',
    border: '1px solid #3b82f6',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 600,
  },

  deleteBtn: {
    padding: '0.45rem 0.75rem',
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    border: '1px solid #ef4444',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 600,
  },

  saveBtn: {
    padding: '0.45rem 0.75rem',
    backgroundColor: '#ecfdf5',
    color: '#10b981',
    border: '1px solid #10b981',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 600,
  },

  cancelBtn: {
    padding: '0.45rem 0.75rem',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
};