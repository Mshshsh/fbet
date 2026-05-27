import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsersApi, setRoleApi, setBanApi, setVipApi } from '../../api';

const VIP_LABELS = ['Yok', 'Bronz', 'Gümüş', 'Altın', 'Platin', 'Elmas'];

const Users = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [alert, setAlert] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search],
    queryFn: () => getUsersApi({ page, limit: 20, search }),
  });
  const users = data?.data?.data?.items || [];
  const total = data?.data?.data?.total || 0;
  const totalPages = data?.data?.data?.totalPages || 1;

  const showAlert = (msg) => { setAlert(msg); setTimeout(() => setAlert(''), 3000); };

  const banMut = useMutation({
    mutationFn: ({ id, isBanned }) => setBanApi(id, isBanned),
    onSuccess: () => { showAlert('✅ Kullanıcı güncellendi.'); qc.invalidateQueries(['admin-users']); },
    onError: (e) => showAlert('❌ ' + (e.response?.data?.error || 'Hata')),
  });

  const roleMut = useMutation({
    mutationFn: ({ id, role }) => setRoleApi(id, role),
    onSuccess: () => { showAlert('✅ Rol güncellendi.'); qc.invalidateQueries(['admin-users']); },
    onError: (e) => showAlert('❌ ' + (e.response?.data?.error || 'Hata')),
  });

  const vipMut = useMutation({
    mutationFn: ({ id, vipLevel }) => setVipApi(id, vipLevel),
    onSuccess: () => { showAlert('✅ VIP güncellendi.'); qc.invalidateQueries(['admin-users']); },
    onError: (e) => showAlert('❌ ' + (e.response?.data?.error || 'Hata')),
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Kullanıcılar ({total})</h1>
      </div>
      {alert && <div className={`alert ${alert.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{alert}</div>}

      <div className="card" style={{ marginBottom: 16 }}>
        <input
          placeholder="Kullanıcı adı ara..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ background: '#1d2028', border: '1px solid #343944', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, width: '100%', outline: 'none' }}
        />
      </div>

      {isLoading ? <div className="loading">Yükleniyor...</div> : (
        <>
          <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th><th>Kullanıcı</th><th>E-posta</th><th>Rol</th><th>VIP</th><th>Puan</th><th>Durum</th><th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ color: '#8a8fa8' }}>{u.id}</td>
                    <td style={{ fontWeight: 600 }}>{u.username}</td>
                    <td style={{ fontSize: 12, color: '#8a8fa8' }}>{u.email}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => roleMut.mutate({ id: u.id, role: e.target.value })}
                        style={{ background: '#1d2028', border: '1px solid #343944', color: '#fff', borderRadius: 6, padding: '3px 6px', fontSize: 12 }}
                      >
                        <option value="user">user</option>
                        <option value="moderator">moderator</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={u.vipLevel}
                        onChange={(e) => vipMut.mutate({ id: u.id, vipLevel: parseInt(e.target.value) })}
                        style={{ background: '#1d2028', border: '1px solid #343944', color: '#fff', borderRadius: 6, padding: '3px 6px', fontSize: 12 }}
                      >
                        {VIP_LABELS.map((label, i) => (
                          <option key={i} value={i}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ color: '#00e257', fontWeight: 600 }}>{u.points?.toLocaleString('tr-TR')}</td>
                    <td>
                      <span className={`badge badge--${u.isBanned ? 'danger' : 'success'}`}>
                        {u.isBanned ? 'Banlı' : 'Aktif'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn-sm ${u.isBanned ? 'btn-primary' : 'btn-danger'}`}
                        onClick={() => banMut.mutate({ id: u.id, isBanned: !u.isBanned })}
                      >
                        {u.isBanned ? 'Aktifleştir' : 'Banla'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center' }}>
            <button className="btn-secondary btn-sm" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>← Önceki</button>
            <span style={{ fontSize: 13, color: '#8a8fa8' }}>Sayfa {page} / {totalPages}</span>
            <button className="btn-secondary btn-sm" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page >= totalPages}>Sonraki →</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;
