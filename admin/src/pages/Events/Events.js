import React from 'react';
import CrudPage from '../../components/common/CrudPage';
import { getEventsApi, createEventApi, updateEventApi, deleteEventApi } from '../../api';

const fields = [
  { name: 'title', label: 'Başlık', required: true },
  { name: 'description', label: 'Açıklama', type: 'textarea' },
  { name: 'startDate', label: 'Başlangıç Tarihi', type: 'datetime-local' },
  { name: 'endDate', label: 'Bitiş Tarihi', type: 'datetime-local' },
  { name: 'imageUrl', label: 'Resim URL' },
  { name: 'link', label: 'Bağlantı URL' },
  { name: 'isActive', label: 'Aktif', type: 'checkbox', defaultValue: true },
];

const columns = [
  { key: 'id', label: '#' },
  { key: 'title', label: 'Başlık' },
  { key: 'startDate', label: 'Başlangıç', render: (r) => r.startDate ? new Date(r.startDate).toLocaleDateString('tr-TR') : '-' },
  { key: 'endDate', label: 'Bitiş', render: (r) => r.endDate ? new Date(r.endDate).toLocaleDateString('tr-TR') : '-' },
  { key: 'isActive', label: 'Durum', render: (r) => (
    <span className={`badge badge--${r.isActive ? 'success' : 'warning'}`}>{r.isActive ? 'Aktif' : 'Pasif'}</span>
  )},
];

const Events = () => (
  <CrudPage
    title="Etkinlikler"
    queryKey="admin-events"
    listFn={getEventsApi}
    createFn={createEventApi}
    updateFn={updateEventApi}
    deleteFn={deleteEventApi}
    fields={fields}
    columns={columns}
  />
);

export default Events;
