import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import TagManager from '../components/TagManager';
import Filters from '../components/Filters';
import Logo from '../components/Logo';

export default function Dashboard() {
  const [dark, setDark] = useState(
    localStorage.getItem('darkMode') === 'true'
  );
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    tag: '',
    search: ''
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.search) params.append('search', filters.search);

      const res = await axios.get(`/tasks?${params.toString()}`);
      setTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchTags = async () => {
    try {
      const res = await axios.get('/tags');
      setTags(res.data);
    } catch (err) {
      console.error('Failed to load tags');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchTags();
  }, []);

  const handleTaskSaved = () => {
    setShowTaskForm(false);
    setEditTask(null);
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowTaskForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await axios.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleMarkDone = async (id) => {
    try {
      await axios.patch(`/tasks/${id}/done`);
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleReopen = async (id) => {
    try {
      await axios.patch(`/tasks/${id}/reopen`);
      fetchTasks();
    } catch (err) {
      setError('Failed to reopen task');
    }
  };

  const refreshData = async () => {
    await Promise.all([fetchTasks(), fetchTags()]);
  };

  return (
    <div style={{
      ...styles.container,
      backgroundColor: dark ? '#0a0a14' : '#f8fafc',
      color: dark ? '#f1f5f9' : '#0f172a'
    }}>
      {/* PREMIUM STICKY NAVBAR */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.headerLeft}>
            <Logo size={40} />
            <h1 style={styles.logo}>TaskManager</h1>
          </div>
          
          <div style={styles.headerRight}>
            <span style={styles.userName}>Hi, {user?.name}</span>
            <div style={styles.divider} />
            <button style={styles.tagBtn} onClick={() => setShowTagManager(!showTagManager)}>
              Tags
            </button>
            <button style={styles.tagBtn} onClick={() => {
              const newDark = !dark;
              setDark(newDark);
              localStorage.setItem('darkMode', newDark);
            }}>
              {dark ? '☀️' : '🌙'}
            </button>
            <button style={styles.logoutBtn} onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* CENTERED MAIN CONTENT */}
      <main style={styles.main}>
        {showTagManager && (
          <TagManager tags={tags} onTagsChange={refreshData} dark={dark} />
        )}

        <Filters filters={filters} setFilters={setFilters} tags={tags} dark={dark} />

        <div style={styles.taskHeader}>
          <h2 style={styles.taskTitle}>My Tasks</h2>
          <button style={styles.addBtn} onClick={() => {
            setEditTask(null);
            setShowTaskForm(true);
          }}>
            + Add Task
          </button>
        </div>

        {showTaskForm && (
          <TaskForm
            tags={tags}
            editTask={editTask}
            onSaved={handleTaskSaved}
            onCancel={() => {
              setShowTaskForm(false);
              setEditTask(null);
            }}
            onTagsRefresh={fetchTags}
            dark={dark}
          />
        )}

        {error && <div style={styles.error}>{error}</div>}

        {loading ? (
          <div style={styles.center}>Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div style={{
            ...styles.empty,
            backgroundColor: dark ? '#151525' : '#fff',
            borderColor: dark ? '#2a2a40' : '#e2e8f0',
          }}>
            <p>No tasks found. Create your first task!</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMarkDone={handleMarkDone}
            onReopen={handleReopen}
            dark={dark}
          />
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease'
  },
  header: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%',
    boxShadow: '0 4px 25px rgba(0,0,0, 0.2)',
    boxSizing: 'border-box',
  },
  headerInner: {
    width: '100%',
    padding: '1rem 3rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  logo: {
    color: '#fff',
    margin: 0,
    fontSize: '1.85rem',
    fontWeight: 900,
    letterSpacing: '-1.5px',
    whiteSpace: 'nowrap',
    textShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  headerRight: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '1.25rem' 
  },
  userName: {
    color: '#f0f4ff',
    fontSize: '1.1rem',
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },
  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: 'rgba(255,255,255,0.3)',
    margin: '0 0.5rem'
  },
  tagBtn: {
    padding: '0.65rem 1.25rem',
    backgroundColor: 'rgba(255,255,255,0.12)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 700,
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(8px)',
  },
  logoutBtn: {
    padding: '0.65rem 1.5rem',
    backgroundColor: '#fff',
    color: '#4f46e5',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 900,
    fontSize: '0.95rem',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.15)',
  },
  main: {
    maxWidth: '1100px',
    width: '100%',
    margin: '0 auto',
    padding: '2.5rem 1.5rem',
    boxSizing: 'border-box'
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  taskTitle: {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: 800,
    letterSpacing: '-0.5px'
  },
  addBtn: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.9rem',
    boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
  },
  error: {
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
    border: '1px solid #fee2e2',
    fontWeight: 500
  },
  center: {
    textAlign: 'center',
    padding: '5rem',
    color: '#94a3b8',
    fontSize: '1rem'
  },
  empty: {
    textAlign: 'center',
    padding: '5rem 2rem',
    borderRadius: '16px',
    border: '2px dashed #e2e8f0',
    fontSize: '1.1rem'
  }
};