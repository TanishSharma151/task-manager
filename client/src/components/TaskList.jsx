const priorityColors = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444'
};

const statusColors = {
  'todo': '#6b7280',
  'in-progress': '#3b82f6',
  'done': '#10b981'
};

export default function TaskList({ tasks, onEdit, onDelete, onMarkDone }) {
  return (
    <div style={styles.list}>
      {tasks.map(task => (
        <div key={task._id} style={{
          ...styles.card,
          opacity: task.status === 'done' ? 0.7 : 1
        }}>
          <div style={styles.cardHeader}>
            <div style={styles.titleRow}>
              <h3 style={{
                ...styles.title,
                textDecoration: task.status === 'done' ? 'line-through' : 'none'
              }}>
                {task.title}
              </h3>
              <div style={styles.badges}>
                <span style={{
                  ...styles.badge,
                  backgroundColor: priorityColors[task.priority] + '20',
                  color: priorityColors[task.priority]
                }}>
                  {task.priority}
                </span>
                <span style={{
                  ...styles.badge,
                  backgroundColor: statusColors[task.status] + '20',
                  color: statusColors[task.status]
                }}>
                  {task.status}
                </span>
              </div>
            </div>
            <div style={styles.actions}>
              {task.status !== 'done' && (
                <button style={styles.doneBtn} onClick={() => onMarkDone(task._id)}>
                  ✓ Done
                </button>
              )}
              <button style={styles.editBtn} onClick={() => onEdit(task)}>
                Edit
              </button>
              <button style={styles.deleteBtn} onClick={() => onDelete(task._id)}>
                Delete
              </button>
            </div>
          </div>

          {task.description && (
            <p style={styles.description}>{task.description}</p>
          )}

          <div style={styles.cardFooter}>
            {task.dueDate && (
              <span style={styles.dueDate}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            <div style={styles.tags}>
              {task.tags?.map(tag => (
                <span key={tag._id} style={styles.tag}>#{tag.name}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  list: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1.25rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  titleRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' },
  title: { margin: 0, fontSize: '1rem', color: '#1a1a1a' },
  badges: { display: 'flex', gap: '0.5rem' },
  badge: {
    padding: '0.2rem 0.6rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'capitalize'
  },
  actions: { display: 'flex', gap: '0.5rem' },
  doneBtn: {
    padding: '0.375rem 0.75rem',
    backgroundColor: '#ecfdf5',
    color: '#10b981',
    border: '1px solid #10b981',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 600
  },
  editBtn: {
    padding: '0.375rem 0.75rem',
    backgroundColor: '#eff6ff',
    color: '#3b82f6',
    border: '1px solid #3b82f6',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  deleteBtn: {
    padding: '0.375rem 0.75rem',
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    border: '1px solid #ef4444',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  description: { color: '#6b7280', fontSize: '0.875rem', margin: '0.75rem 0 0' },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.75rem',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  dueDate: { color: '#9ca3af', fontSize: '0.8rem' },
  tags: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  tag: {
    backgroundColor: '#ede9fe',
    color: '#7c3aed',
    padding: '0.2rem 0.6rem',
    borderRadius: '999px',
    fontSize: '0.75rem'
  }
};