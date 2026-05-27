import React from 'react';
import CrudPage from '../../components/common/CrudPage';
import { getTournamentsApi, createTournamentApi, updateTournamentApi } from '../../api';

const fields = [
  { name: 'name', label: 'Turnuva Adı', required: true },
  { name: 'description', label: 'Açıklama', type: 'textarea' },
  { name: 'prizePool', label: 'Ödül Havuzu' },
  { name: 'startDate', label: 'Başlangıç Tarihi', type: 'datetime-local' },
  { name: 'endDate', label: 'Bitiş Tarihi', type: 'datetime-local' },
  { name: 'imageUrl', label: 'Resim URL' },
  { name: 'status', label: 'Durum', type: 'select', defaultValue: 'upcoming', options: [
    { value: 'upcoming', label: 'Yakında' },
    { value: 'active', label: 'Aktif' },
    { value: 'ended', label: 'Bitti' },
  ]},
];

const columns = [
  { key: 'id', label: '#' },
  { key: 'name', label: 'Ad' },
  { key: 'prizePool', label: 'Ödül Havuzu' },
  { key: 'status', label: 'Durum', render: (r) => (
    <span className={`badge badge--${r.status === 'active' ? 'success' : r.status === 'upcoming' ? 'info' : 'warning'}`}>
      {r.status === 'active' ? 'Aktif' : r.status === 'upcoming' ? 'Yakında' : 'Bitti'}
    </span>
  )},
  { key: 'startDate', label: 'Başlangıç', render: (r) => r.startDate ? new Date(r.startDate).toLocaleDateString('tr-TR') : '-' },
];

const Tournaments = () => (
  <CrudPage
    title="Turnuvalar"
    queryKey="admin-tournaments"
    listFn={getTournamentsApi}
    createFn={createTournamentApi}
    updateFn={updateTournamentApi}
    deleteFn={null}
    fields={fields}
    columns={columns}
  />
);

export default Tournaments;
