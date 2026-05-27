import React from 'react';
import CrudPage from '../../components/common/CrudPage';
import { getSpecialOddsApi, createSpecialOddApi, updateSpecialOddApi, deleteSpecialOddApi } from '../../api';

const fields = [
  { name: 'title', label: 'Başlık / Maç Adı', required: true },
  { name: 'match', label: 'Maç (örn: GS vs FB)' },
  { name: 'odds', label: 'Oran', type: 'number', defaultValue: 0 },
  { name: 'sport', label: 'Spor Dalı (örn: Futbol)' },
  { name: 'bookmaker', label: 'Bahis Sitesi' },
  { name: 'description', label: 'Açıklama', type: 'textarea' },
  { name: 'expiresAt', label: 'Son Geçerlilik', type: 'datetime-local' },
  { name: 'isActive', label: 'Aktif', type: 'checkbox', defaultValue: true },
];

const columns = [
  { key: 'id', label: '#' },
  { key: 'title', label: 'Başlık' },
  { key: 'match', label: 'Maç' },
  { key: 'odds', label: 'Oran', render: (r) => <strong style={{ color: '#ffc107' }}>{r.odds}</strong> },
  { key: 'sport', label: 'Spor' },
  { key: 'bookmaker', label: 'Site' },
  { key: 'isActive', label: 'Durum', render: (r) => (
    <span className={`badge badge--${r.isActive ? 'success' : 'warning'}`}>{r.isActive ? 'Aktif' : 'Pasif'}</span>
  )},
];

const SpecialOdds = () => (
  <CrudPage
    title="Özel Oranlar"
    queryKey="admin-special-odds"
    listFn={getSpecialOddsApi}
    createFn={createSpecialOddApi}
    updateFn={updateSpecialOddApi}
    deleteFn={deleteSpecialOddApi}
    fields={fields}
    columns={columns}
  />
);

export default SpecialOdds;
