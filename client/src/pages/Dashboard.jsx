import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import TagManager from '../components/TagManager';
import Filters from '../components/Filters';

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
  },[filters]);

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
  }, [filters]);

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
      backgroundColor: dark ? '#0f0f1a' : '#f9fafb',
      color: dark ? '#e5e7eb' : '#1a1a1a'
    }}>
      <div style={styles.header}>
        <h1 style={styles.logo}>TaskManager</h1>
        <div style={styles.headerRight}>
          <span style={styles.userName}>Hi, {user?.name}</span>
          <button style={styles.tagBtn} onClick={() => setShowTagManager(!showTagManager)}>
            Tags
          </button>
          <button style={styles.tagBtn} onClick={() => {
            const newDark = !dark;
            setDark(newDark);
            localStorage.setItem('darkMode', newDark);
          }}>
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div style={{
        ...styles.main,
        backgroundColor: dark ? '#0f0f1a' : 'transparent'
      }}>
        {showTagManager && (
          <TagManager tags={tags} onTagsChange={refreshData} dark={dark} />
        )}

        <Filters filters={filters} setFilters={setFilters} tags={tags} dark={dark} />

        <div style={styles.taskHeader}>
          <h2 style={{
            ...styles.taskTitle,
            color: dark ? '#e5e7eb' : '#1a1a1a'
          }}>
            My Tasks
          </h2>
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
            backgroundColor: dark ? '#1a1a2e' : '#fff',
            borderColor: dark ? '#2d2d44' : '#e5e7eb',
            color: dark ? '#9ca3af' : '#9ca3af'
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
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    transition: 'all 0.3s ease'
  },
  header: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)'
  },
  logo: {
    color: '#fff',
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: '-0.5px'
  },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  userName: {
    color: '#e0e7ff',
    fontSize: '0.875rem',
    fontWeight: 500
  },
  tagBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
    backdropFilter: 'blur(10px)'
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#fff',
    color: '#4f46e5',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.875rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  main: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem'
  },
  taskTitle: {
    margin: 0,
    color: '#1a1a1a',
    fontSize: '1.25rem',
    fontWeight: 700
  },
  addBtn: {
    padding: '0.625rem 1.25rem',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.875rem',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)'
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    border: '1px solid #fecaca'
  },
  center: {
    textAlign: 'center',
    padding: '3rem',
    color: '#9ca3af',
    fontSize: '0.875rem'
  },
  empty: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: '#9ca3af',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '2px dashed #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  }
};