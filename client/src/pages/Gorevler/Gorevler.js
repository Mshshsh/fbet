import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasksApi, completeTaskApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import './Gorevler.css';

const Gorevler = () => {
  const { user, updateUser } = useAuth();
  const qc = useQueryClient();
  const [message, setMessage] = useState('');

  const { data, isLoading } = useQuery({ queryKey: ['tasks'], queryFn: getTasksApi });
  const tasks = data?.data?.data || [];

  const completeMutation = useMutation({
    mutationFn: (id) => completeTaskApi(id),
    onSuccess: (res, id) => {
      setMessage(`✅ Görev tamamlandı! +${res.data.data.reward} puan`);
      updateUser({ points: res.data.data.newBalance });
      qc.invalidateQueries(['tasks']);
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (err) => {
      setMessage(`❌ ${err.response?.data?.error || 'Hata oluştu'}`);
      setTimeout(() => setMessage(''), 3000);
    },
  });

  if (isLoading) return <div className="loading-spinner">Yükleniyor...</div>;

  const typeLabel = { daily: 'Günlük', weekly: 'Haftalık', 'one-time': 'Tek Seferlik' };

  return (
    <div className="page-container">
      <h1 className="page-title">Görevler</h1>
      {message && (
        <div className="task-message" style={{ color: message.startsWith('✅') ? '#00e257' : '#ff6b6b' }}>
          {message}
        </div>
      )}
      {tasks.length === 0 ? (
        <div className="empty-state"><p>Henüz görev eklenmemiş.</p></div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div key={task.id} className={`task-card card ${task.completed ? 'task-card--done' : ''}`}>
              {task.imageUrl && (
                <img src={task.imageUrl} alt={task.title} className="task-image" />
              )}
              <div className="task-body">
                <div className="task-header">
                  <span className="badge badge--info">{typeLabel[task.type] || task.type}</span>
                  <span className="task-reward">+{task.reward} Puan</span>
                </div>
                <h3 className="task-title">{task.title}</h3>
                {task.description && <p className="task-desc">{task.description}</p>}
                {task.externalLink && (
                  <a href={task.externalLink} target="_blank" rel="noopener noreferrer" className="task-link">
                    Göreve Git →
                  </a>
                )}
                {task.completed ? (
                  <button className="btn-secondary" disabled>✓ Tamamlandı</button>
                ) : user ? (
                  <button
                    className="btn-primary"
                    onClick={() => completeMutation.mutate(task.id)}
                    disabled={completeMutation.isPending}
                  >
                    {completeMutation.isPending ? 'İşleniyor...' : 'Tamamla'}
                  </button>
                ) : (
                  <button className="btn-secondary" disabled>Giriş Yapın</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gorevler;
