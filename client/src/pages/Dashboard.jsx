import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import TagManager from '../components/TagManager';
import Filters from '../components/Filters';

export default function Dashboard() {
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

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.tag) params.tag = filters.tag;
      if (filters.search) params.search = filters.search;
      const res = await axios.get('/tasks', { params });
      setTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.logo}>TaskManager</h1>
        <div style={styles.headerRight}>
          <span style={styles.userName}>Hi, {user?.name}</span>
          <button style={styles.tagBtn} onClick={() => setShowTagManager(!showTagManager)}>
            Tags
          </button>
          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.main}>
        {/* Tag Manager */}
        {showTagManager && (
          <TagManager tags={tags} onTagsChange={fetchTags} />
        )}

        {/* Filters */}
        <Filters filters={filters} setFilters={setFilters} tags={tags} />

        {/* Add Task Button */}
        <div style={styles.taskHeader}>
          <h2 style={styles.taskTitle}>My Tasks</h2>
          <button style={styles.addBtn} onClick={() => {
            setEditTask(null);
            setShowTaskForm(true);
          }}>
            + Add Task
          </button>
        </div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <TaskForm
            tags={tags}
            editTask={editTask}
            onSaved={handleTaskSaved}
            onCancel={() => {
              setShowTaskForm(false);
              setEditTask(null);
            }}
          />
        )}

        {/* Error */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Task List */}
        {loading ? (
          <div style={styles.center}>Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div style={styles.empty}>
            <p>No tasks found. Create your first task!</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMarkDone={handleMarkDone}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f9fafb' },
  header: {
    backgroundColor: '#4f46e5',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: { color: '#fff', margin: 0, fontSize: '1.5rem' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  userName: { color: '#e0e7ff', fontSize: '0.875rem' },
  tagBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    color: '#fff',
    border: '1px solid #fff',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#fff',
    color: '#4f46e5',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.875rem'
  },
  main: { maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  taskTitle: { margin: 0, color: '#1a1a1a' },
  addBtn: {
    padding: '0.625rem 1.25rem',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '6px',
    marginBottom: '1rem'
  },
  center: { textAlign: 'center', padding: '2rem', color: '#666' },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#9ca3af',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '2px dashed #e5e7eb'
  }
};