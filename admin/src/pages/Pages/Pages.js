import React from 'react';
import CrudPage from '../../components/common/CrudPage';
import { getPagesApi, createPageApi, updatePageApi, deletePageApi } from '../../api';

const fields = [
  { name: 'title', label: 'Başlık', required: true },
  { name: 'slug', label: 'Slug (örn: home, vip)', required: true },
  { name: 'content', label: 'İçerik (HTML)', type: 'textarea' },
  { name: 'isPublished', label: 'Yayınla', type: 'checkbox', defaultValue: true },
];

const columns = [
  { key: 'id', label: '#' },
  { key: 'title', label: 'Başlık' },
  { key: 'slug', label: 'Slug' },
  { key: 'isPublished', label: 'Durum', render: (r) => <span className={`badge badge--${r.isPublished ? 'success' : 'warning'}`}>{r.isPublished ? 'Yayında' : 'Taslak'}</span> },
];

const Pages = () => (
  <CrudPage
    title="CMS Sayfaları"
    queryKey="admin-pages"
    listFn={getPagesApi}
    createFn={createPageApi}
    updateFn={updatePageApi}
    deleteFn={deletePageApi}
    fields={fields}
    columns={columns}
  />
);

export default Pages;
