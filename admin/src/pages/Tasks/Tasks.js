import React from 'react';
import CrudPage from '../../components/common/CrudPage';
import { getTasksApi, createTaskApi, updateTaskApi, deleteTaskApi } from '../../api';

const fields = [
  { name: 'title', label: 'Başlık', required: true },
  { name: 'description', label: 'Açıklama', type: 'textarea' },
  { name: 'reward', label: 'Puan Ödülü', type: 'number', defaultValue: 0 },
  { name: 'type', label: 'Tür', type: 'select', defaultValue: 'one-time', options: [
    { value: 'one-time', label: 'Tek Seferlik' },
    { value: 'daily', label: 'Günlük' },
    { value: 'weekly', label: 'Haftalık' },
  ]},
  { name: 'externalLink', label: 'Harici Link' },
  { name: 'imageUrl', label: 'Resim URL' },
  { name: 'isActive', label: 'Aktif', type: 'checkbox', defaultValue: true },
];

const columns = [
  { key: 'id', label: '#' },
  { key: 'title', label: 'Başlık' },
  { key: 'type', label: 'Tür', render: (r) => <span className="badge badge--info">{r.type}</span> },
  { key: 'reward', label: 'Puan', render: (r) => <span style={{ color: '#00e257' }}>+{r.reward}</span> },
  { key: 'isActive', label: 'Durum', render: (r) => <span className={`badge badge--${r.isActive ? 'success' : 'danger'}`}>{r.isActive ? 'Aktif' : 'Pasif'}</span> },
];

const Tasks = () => (
  <CrudPage
    title="Görevler"
    queryKey="admin-tasks"
    listFn={getTasksApi}
    createFn={createTaskApi}
    updateFn={updateTaskApi}
    deleteFn={deleteTaskApi}
    fields={fields}
    columns={columns}
  />
);

export default Tasks;
