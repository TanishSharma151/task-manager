export default function Filters({ filters, setFilters, tags }) {
  return (
    <div style={styles.container}>
      <input
        style={styles.search}
        type="text"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={e => setFilters({ ...filters, search: e.target.value })}
      />
      <select
        style={styles.select}
        value={filters.status}
        onChange={e => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="">All Status</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <select
        style={styles.select}
        value={filters.priority}
        onChange={e => setFilters({ ...filters, priority: e.target.value })}
      >
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select
        style={styles.select}
        value={filters.tag}
        onChange={e => setFilters({ ...filters, tag: e.target.value })}
      >
        <option value="">All Tags</option>
        {tags.map(tag => (
          <option key={tag._id} value={tag._id}>{tag.name}</option>
        ))}
      </select>
      <button
        style={styles.clearBtn}
        onClick={() => setFilters({ status: '', priority: '', tag: '', search: '' })}
      >
        Clear
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  search: {
    flex: 1,
    minWidth: '200px',
    padding: '0.625rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    outline: 'none'
  },
  select: {
    padding: '0.625rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    outline: 'none',
    backgroundColor: '#fff',
    cursor: 'pointer'
  },
  clearBtn: {
    padding: '0.625rem 1rem',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    color: '#374151'
  }
};