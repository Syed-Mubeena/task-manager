import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://task-manager-backend-XXXX.onrender.com/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [form, setForm] = useState({ username: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { if (token) fetchTasks(); }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/tasks`, authHeaders);
      setTasks(res.data);
    } catch { logout(); }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const url = isLogin ? `${API}/auth/login` : `${API}/auth/register`;
      const res = await axios.post(url, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      setToken(res.data.token);
      setUsername(res.data.username);
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    try {
      const res = await axios.post(`${API}/tasks`, newTask, authHeaders);
      setTasks([res.data, ...tasks]);
      setNewTask({ title: '', description: '' });
    } catch (err) { setError(err.response?.data?.msg || 'Error'); }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(`${API}/tasks/${id}`, { status }, authHeaders);
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch { }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/tasks/${id}`, authHeaders);
      setTasks(tasks.filter(t => t._id !== id));
    } catch { }
  };

  const logout = () => {
    localStorage.clear();
    setToken(''); setUsername(''); setTasks([]);
  };

  const statusColor = { todo: '#534AB7', 'in-progress': '#d4860b', done: '#1a7a4a' };
  const statusBg = { todo: 'rgba(83,74,183,0.12)', 'in-progress': 'rgba(212,134,11,0.12)', done: 'rgba(26,122,74,0.12)' };

  // AUTH SCREEN
  if (!token) return (
    <div style={{ minHeight: '100vh', background: '#0f0f13', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI',sans-serif" }}>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(175,169,236,0.2)', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '380px' }}>
        <h2 style={{ color: '#f0eeff', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
          {isLogin ? '👋 Welcome back' : '🚀 Create account'}
        </h2>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '1.5rem' }}>Task Manager</p>
        {error && <div style={{ background: 'rgba(220,50,50,0.1)', border: '0.5px solid rgba(220,50,50,0.3)', color: '#f87171', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input required placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '0.5px solid rgba(175,169,236,0.2)', background: 'rgba(255,255,255,0.04)', color: '#e8e6f0', fontSize: '14px', outline: 'none' }} />
          <input required type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '0.5px solid rgba(175,169,236,0.2)', background: 'rgba(255,255,255,0.04)', color: '#e8e6f0', fontSize: '14px', outline: 'none' }} />
          <button type="submit" style={{ background: '#534AB7', color: '#fff', border: 'none', padding: '11px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '13px', color: '#666' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{ color: '#AFA9EC', cursor: 'pointer' }}>
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );

  // TASK COLUMNS
  const columns = ['todo', 'in-progress', 'done'];
  const colLabels = { todo: '📋 To Do', 'in-progress': '⚡ In Progress', done: '✅ Done' };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f13', fontFamily: "'Segoe UI',sans-serif", color: '#e8e6f0' }}>

      {/* NAVBAR */}
      <nav style={{ background: 'rgba(15,15,19,0.95)', borderBottom: '0.5px solid rgba(175,169,236,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: '56px' }}>
        <div style={{ fontWeight: 700, color: '#AFA9EC', fontSize: '16px' }}>✅ TaskFlow</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#888' }}>Hi, <span style={{ color: '#AFA9EC' }}>{username}</span></span>
          <button onClick={logout} style={{ background: 'transparent', border: '0.5px solid rgba(175,169,236,0.3)', color: '#AFA9EC', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>

        {/* ADD TASK */}
        <form onSubmit={addTask} style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(175,169,236,0.12)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontSize: '13px', color: '#534AB7', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Add New Task</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input required placeholder="Task title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              style={{ flex: 1, minWidth: '180px', padding: '9px 14px', borderRadius: '8px', border: '0.5px solid rgba(175,169,236,0.2)', background: 'rgba(255,255,255,0.04)', color: '#e8e6f0', fontSize: '14px', outline: 'none' }} />
            <input placeholder="Description (optional)" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              style={{ flex: 2, minWidth: '200px', padding: '9px 14px', borderRadius: '8px', border: '0.5px solid rgba(175,169,236,0.2)', background: 'rgba(255,255,255,0.04)', color: '#e8e6f0', fontSize: '14px', outline: 'none' }} />
            <button type="submit" style={{ background: '#534AB7', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Add Task</button>
          </div>
        </form>

        {/* STATS */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {columns.map(col => (
            <div key={col} style={{ flex: 1, minWidth: '120px', background: 'rgba(255,255,255,0.03)', border: `0.5px solid ${statusColor[col]}33`, borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: statusColor[col] }}>{tasks.filter(t => t.status === col).length}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{colLabels[col]}</div>
            </div>
          ))}
          <div style={{ flex: 1, minWidth: '120px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(175,169,236,0.15)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#AFA9EC' }}>{tasks.length}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Total</div>
          </div>
        </div>

        {/* KANBAN COLUMNS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {columns.map(col => (
            <div key={col} style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(175,169,236,0.08)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: statusColor[col] }}>{colLabels[col]}</span>
                <span style={{ fontSize: '11px', background: statusBg[col], color: statusColor[col], padding: '2px 8px', borderRadius: '20px' }}>{tasks.filter(t => t.status === col).length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tasks.filter(t => t.status === col).map(task => (
                  <div key={task._id} style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(175,169,236,0.1)', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#f0eeff', flex: 1 }}>{task.title}</div>
                      <button onClick={() => deleteTask(task._id)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '16px', padding: '0 0 0 8px' }}>×</button>
                    </div>
                    {task.description && <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>{task.description}</div>}
                    <select value={task.status} onChange={e => updateStatus(task._id, e.target.value)}
                      style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: `0.5px solid ${statusColor[task.status]}44`, background: statusBg[task.status], color: statusColor[task.status], fontSize: '12px', cursor: 'pointer', outline: 'none' }}>
                      <option value="todo">📋 To Do</option>
                      <option value="in-progress">⚡ In Progress</option>
                      <option value="done">✅ Done</option>
                    </select>
                  </div>
                ))}
                {tasks.filter(t => t.status === col).length === 0 && (
                  <div style={{ textAlign: 'center', color: '#444', fontSize: '13px', padding: '1.5rem 0' }}>No tasks</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
