import React from 'react';
import CrudPage from '../../components/common/CrudPage';
import { getWinsApi, createWinApi, deleteWinApi } from '../../api';

const fields = [
  { name: 'username', label: 'Kullanıcı Adı', required: true },
  { name: 'gameName', label: 'Oyun Adı', required: true },
  { name: 'multiplier', label: 'Çarpan (sayı, örn: 250)', type: 'number', defaultValue: 0 },
  { name: 'winAmount', label: 'Kazanç Miktarı (TRY)', type: 'number', defaultValue: 0 },
  { name: 'currency', label: 'Para Birimi', defaultValue: 'TRY' },
  { name: 'imageUrl', label: 'Resim URL (opsiyonel)' },
];

const columns = [
  { key: 'id', label: '#' },
  { key: 'username', label: 'Kullanıcı' },
  { key: 'gameName', label: 'Oyun' },
  { key: 'multiplier', label: 'Çarpan', render: (r) => r.multiplier ? <span style={{ color: '#ffc107', fontWeight: 700 }}>{r.multiplier}x</span> : '-' },
  { key: 'winAmount', label: 'Kazanç', render: (r) => r.winAmount ? <span style={{ color: '#00e257' }}>{Number(r.winAmount).toLocaleString('tr-TR')} {r.currency}</span> : '-' },
];

const Wins = () => (
  <CrudPage
    title="Kazanma Feed"
    queryKey="admin-wins"
    listFn={getWinsApi}
    createFn={createWinApi}
    updateFn={null}
    deleteFn={deleteWinApi}
    fields={fields}
    columns={columns}
  />
);

export default Wins;
