export default function Filters({ filters, setFilters, tags, dark }) {
  return (
    <div style={{
      ...styles.container,
      backgroundColor: dark ? '#1a1a2e' : '#fff',
    }}>
      <input
        style={{
          ...styles.search,
          backgroundColor: dark ? '#0f0f1a' : '#fff',
          color: dark ? '#e5e7eb' : '#1a1a1a',
          borderColor: dark ? '#2d2d44' : '#d1d5db'
        }}
        type="text"
        placeholder="Search tasks"
        value={filters.search}
        onChange={e => setFilters({ ...filters, search: e.target.value })}
      />
      <select
        style={{
          ...styles.select,
          backgroundColor: dark ? '#0f0f1a' : '#fff',
          color: dark ? '#e5e7eb' : '#374151',
          borderColor: dark ? '#2d2d44' : '#d1d5db'
        }}
        value={filters.status}
        onChange={e => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="">All Status</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <select
        style={{
          ...styles.select,
          backgroundColor: dark ? '#0f0f1a' : '#fff',
          color: dark ? '#e5e7eb' : '#374151',
          borderColor: dark ? '#2d2d44' : '#d1d5db'
        }}
        value={filters.priority}
        onChange={e => setFilters({ ...filters, priority: e.target.value })}
      >
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select
        style={{
          ...styles.select,
          backgroundColor: dark ? '#0f0f1a' : '#fff',
          color: dark ? '#e5e7eb' : '#374151',
          borderColor: dark ? '#2d2d44' : '#d1d5db'
        }}
        value={filters.tag}
        onChange={e => setFilters({ ...filters, tag: e.target.value })}
      >
        <option value="">All Tags</option>
        {tags.map(tag => (
          <option key={tag._id} value={tag._id}>{tag.name}</option>
        ))}
      </select>
      <button
        style={{
          ...styles.clearBtn,
          backgroundColor: dark ? '#1a1a2e' : '#f3f4f6',
          color: dark ? '#e5e7eb' : '#374151',
          borderColor: dark ? '#2d2d44' : '#d1d5db'
        }}
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