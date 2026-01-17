import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';
import { isAuthenticated, isAdmin, clearAuthData } from '../../utils/auth';

const AdminHealthTips = () => {
  const navigate = useNavigate();

  const [allTips, setAllTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingTip, setEditingTip] = useState(null);
  const [selectedTipIds, setSelectedTipIds] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      window.location.href = '/login';
      return;
    }
    fetchHealthTips();
  }, []);

  /* =========================
     FETCH ALL HEALTH TIPS
  ========================= */
  const fetchHealthTips = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/health-tips`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch health tips');

      const data = await res.json();
      setAllTips(data || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load health tips');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FORM HANDLING
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) return setError('Title is required'), false;
    if (!formData.content.trim()) return setError('Content is required'), false;
    return true;
  };

  /* =========================
     ADD / UPDATE TIP
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const url = editingTip
        ? `${API_BASE_URL}/health-tips/${editingTip._id}`
        : `${API_BASE_URL}/health-tips`;

      const method = editingTip ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Save failed');
      }

      setSuccess(editingTip ? '✅ Health tip updated!' : '✅ Health tip created!');
      setFormData({ title: '', content: '' });
      setEditingTip(null);
      fetchHealthTips();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE TIP
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this health tip?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/health-tips/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Delete failed');

      setAllTips(prev => prev.filter(t => t._id !== id));
      setSuccess('✅ Health tip deleted');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to delete health tip');
    }
  };

  /* =========================
     SEND TIPS TO USERS
  ========================= */
  const handleSendTips = async () => {
    if (selectedTipIds.length === 0) {
      setError('Select at least one tip');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/health-tips/send/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tipIds: selectedTipIds }),
      });

      if (!res.ok) throw new Error('Publish failed');

      setSuccess(`✅ ${selectedTipIds.length} tip(s) published`);
      setSelectedTipIds([]);
      fetchHealthTips();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    window.location.href = '/login';
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">💡 Manage Health Tips</h1>
        <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded">Logout</button>
      </div>

      {error && <div className="bg-red-700 p-3 mb-4">{error}</div>}
      {success && <div className="bg-green-700 p-3 mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full mb-2 p-2 bg-slate-800"
        />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Content"
          className="w-full mb-2 p-2 bg-slate-800"
        />
        <button className="bg-green-600 px-4 py-2 rounded">
          {editingTip ? 'Update' : 'Create'}
        </button>
      </form>

      <h2 className="text-xl mb-4">All Health Tips ({allTips.length})</h2>

      {allTips.map(tip => (
        <div key={tip._id} className="bg-slate-800 p-4 mb-3">
          <input
            type="checkbox"
            checked={selectedTipIds.includes(tip._id)}
            onChange={() =>
              setSelectedTipIds(prev =>
                prev.includes(tip._id)
                  ? prev.filter(id => id !== tip._id)
                  : [...prev, tip._id]
              )
            }
          />
          <h3 className="text-lg font-bold">{tip.title}</h3>
          <p>{tip.content}</p>
          <div className="flex gap-3 mt-2">
            <button onClick={() => setEditingTip(tip)} className="bg-blue-600 px-3 py-1">Edit</button>
            <button onClick={() => handleDelete(tip._id)} className="bg-red-600 px-3 py-1">Delete</button>
          </div>
        </div>
      ))}

      <button
        onClick={handleSendTips}
        className="bg-cyan-600 px-6 py-3 mt-6 rounded"
      >
        Publish Selected Tips
      </button>
    </div>
  );
};

export default AdminHealthTips;
