import { useState } from 'react';
import axios from '../api/axios';

export default function TaskForm({ tags, editTask, onSaved, onCancel }) {
  const [form, setForm] = useState({
    title: editTask?.title || '',
    description: editTask?.description || '',
    dueDate: editTask?.dueDate ? editTask.dueDate.split('T')[0] : '',
    priority: editTask?.priority || 'medium',
    status: editTask?.status || 'todo',
    tags: editTask?.tags?.map(t => t._id) || []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const handleTagToggle = (tagId) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const handleSmartSuggest = async () => {
    if (!form.title.trim()) {
      return setError('Enter a task title first to get AI suggestions');
    }
    try {
      setAiLoading(true);
      setAiSuggestions(null);
      const res = await axios.post('/ai/suggest', { title: form.title });
      setAiSuggestions(res.data);
    } catch (err) {
      setError('AI suggestion failed. Try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      return setError('Title is required');
    }

    try {
      setLoading(true);
      if (editTask) {
        await axios.put(`/tasks/${editTask._id}`, form);
      } else {
        await axios.post('/tasks', form);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>
          {editTask ? 'Edit Task' : 'New Task'}
        </h3>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Title *</label>
            <div style={styles.titleRow}>
              <input
                style={{ ...styles.input, flex: 1 }}
                type="text"
                placeholder="Task title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
              <button
                type="button"
                style={styles.aiBtn}
                onClick={handleSmartSuggest}
                disabled={aiLoading}
              >
                {aiLoading ? '...' : '✨ Smart Suggest'}
              </button>
            </div>
          </div>

          {/* AI Suggestions */}
          {aiSuggestions && (
            <div style={styles.aiBox}>
              <p style={styles.aiTitle}>✨ AI Suggestions</p>
              {aiSuggestions.subtasks?.length > 0 && (
                <div>
                  <p style={styles.aiLabel}>Suggested Sub-tasks:</p>
                  <ul style={styles.aiList}>
                    {aiSuggestions.subtasks.map((s, i) => (
                      <li key={i} style={styles.aiItem}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {aiSuggestions.tags?.length > 0 && (
                <div>
                  <p style={styles.aiLabel}>Suggested Tags:</p>
                  <div style={styles.aiTags}>
                    {aiSuggestions.tags.map((tag, i) => (
                      <span key={i} style={styles.aiTag}>#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              style={{ ...styles.input, height: '80px', resize: 'vertical' }}
              placeholder="Optional description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Priority</label>
              <select
                style={styles.input}
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Status</label>
              <select
                style={styles.input}
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Due Date</label>
              <input
                style={styles.input}
                type="date"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>

          {tags.length > 0 && (
            <div style={styles.field}>
              <label style={styles.label}>Tags</label>
              <div style={styles.tagList}>
                {tags.map(tag => (
                  <span
                    key={tag._id}
                    style={{
                      ...styles.tagChip,
                      backgroundColor: form.tags.includes(tag._id) ? '#4f46e5' : '#f3f4f6',
                      color: form.tags.includes(tag._id) ? '#fff' : '#374151'
                    }}
                    onClick={() => handleTagToggle(tag._id)}
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={styles.buttons}>
            <button type="button" style={styles.cancelBtn} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" style={styles.saveBtn} disabled={loading}>
              {loading ? 'Saving...' : editTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '560px',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  title: { margin: '0 0 1rem', color: '#1a1a1a' },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    fontSize: '0.875rem'
  },
  field: { marginBottom: '1rem' },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 500,
    color: '#374151',
    fontSize: '0.875rem'
  },
  titleRow: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
  input: {
    width: '100%',
    padding: '0.625rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    boxSizing: 'border-box',
    outline: 'none'
  },
  aiBtn: {
    padding: '0.625rem 1rem',
    backgroundColor: '#7c3aed',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 600,
    whiteSpace: 'nowrap'
  },
  aiBox: {
    backgroundColor: '#f5f3ff',
    border: '1px solid #ddd6fe',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem'
  },
  aiTitle: {
    margin: '0 0 0.75rem',
    fontWeight: 600,
    color: '#7c3aed',
    fontSize: '0.875rem'
  },
  aiLabel: {
    margin: '0 0 0.5rem',
    fontWeight: 500,
    color: '#374151',
    fontSize: '0.8rem'
  },
  aiList: {
    margin: '0 0 0.75rem',
    paddingLeft: '1.25rem'
  },
  aiItem: {
    color: '#4b5563',
    fontSize: '0.8rem',
    marginBottom: '0.25rem'
  },
  aiTags: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  aiTag: {
    backgroundColor: '#ede9fe',
    color: '#7c3aed',
    padding: '0.2rem 0.6rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 500
  },
  row: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  tagList: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  tagChip: {
    padding: '0.3rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    fontWeight: 500
  },
  buttons: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    marginTop: '1.5rem'
  },
  cancelBtn: {
    padding: '0.625rem 1.25rem',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  saveBtn: {
    padding: '0.625rem 1.25rem',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 600
  }
};