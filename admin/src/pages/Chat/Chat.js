import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChatMessagesApi, deleteMessageApi, pinMessageApi, unpinMessageApi, muteUserApi } from '../../api';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const Chat = () => {
  const qc = useQueryClient();
  const [pinContent, setPinContent] = useState('');
  const [alert, setAlert] = useState('');

  const showAlert = (msg) => { setAlert(msg); setTimeout(() => setAlert(''), 3000); };

  const { data, isLoading } = useQuery({ queryKey: ['admin-chat'], queryFn: getChatMessagesApi });
  const messages = data?.data?.data || [];

  const deleteMut = useMutation({
    mutationFn: (id) => deleteMessageApi(id),
    onSuccess: () => { showAlert('✅ Mesaj silindi.'); qc.invalidateQueries(['admin-chat']); },
  });

  const pinMut = useMutation({
    mutationFn: (content) => pinMessageApi(content),
    onSuccess: () => { showAlert('✅ Mesaj sabitlendi.'); setPinContent(''); },
  });

  const unpinMut = useMutation({
    mutationFn: unpinMessageApi,
    onSuccess: () => showAlert('✅ Pin kaldırıldı.'),
  });

  const muteMut = useMutation({
    mutationFn: ({ id, isMuted }) => muteUserApi(id, isMuted),
    onSuccess: () => showAlert('✅ Kullanıcı güncellendi.'),
  });

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: 24 }}>Chat Moderasyon</h1>
      {alert && <div className={`alert ${alert.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{alert}</div>}

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>📌 Mesaj Sabitle</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={pinContent}
            onChange={(e) => setPinContent(e.target.value)}
            placeholder="Sabitlenecek mesajı gir..."
            style={{ flex: 1, background: '#1d2028', border: '1px solid #343944', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none' }}
          />
          <button className="btn-primary btn-sm" onClick={() => pinMut.mutate(pinContent)} disabled={!pinContent.trim()}>Sabitle</button>
          <button className="btn-secondary btn-sm" onClick={() => unpinMut.mutate()}>Pin Kaldır</button>
        </div>
      </div>

      {isLoading ? <div className="loading">Yükleniyor...</div> : (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr><th>Kullanıcı</th><th>Mesaj</th><th>Saat</th><th>İşlem</th></tr>
            </thead>
            <tbody>
              {messages.slice().reverse().map((msg) => (
                <tr key={msg.id} style={{ opacity: msg.isDeleted ? 0.4 : 1 }}>
                  <td>
                    <span style={{ fontWeight: 600, color: msg.user?.color }}>{msg.user?.username}</span>
                    <span style={{ fontSize: 10, color: '#8a8fa8', marginLeft: 6 }}>{msg.user?.role}</span>
                  </td>
                  <td style={{ fontSize: 13 }}>{msg.isDeleted ? <em>Silindi</em> : msg.content}</td>
                  <td style={{ fontSize: 11, color: '#8a8fa8' }}>
                    {format(new Date(msg.createdAt), 'dd.MM HH:mm', { locale: tr })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {!msg.isDeleted && (
                        <button className="btn-danger btn-sm" onClick={() => deleteMut.mutate(msg.id)}>Sil</button>
                      )}
                      {msg.user && (
                        <button
                          className="btn-secondary btn-sm"
                          onClick={() => muteMut.mutate({ id: msg.user.id, isMuted: !msg.user.isMuted })}
                        >
                          {msg.user.isMuted ? 'Susturma Kaldır' : 'Sustur'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Chat;
