import React from 'react';
import CrudPage from '../../components/common/CrudPage';
import { getMarketItemsApi, createMarketItemApi, updateMarketItemApi, deleteMarketItemApi } from '../../api';

const fields = [
  { name: 'name', label: 'İsim', required: true },
  { name: 'description', label: 'Açıklama', type: 'textarea' },
  { name: 'pointCost', label: 'Puan Maliyeti', type: 'number', required: true, defaultValue: 100 },
  { name: 'stock', label: 'Stok (-1 = sınırsız)', type: 'number', defaultValue: -1 },
  { name: 'category', label: 'Kategori', defaultValue: 'bonus' },
  { name: 'imageUrl', label: 'Resim URL' },
  { name: 'isActive', label: 'Aktif', type: 'checkbox', defaultValue: true },
];

const columns = [
  { key: 'id', label: '#' },
  { key: 'name', label: 'İsim' },
  { key: 'pointCost', label: 'Maliyet', render: (r) => <span style={{ color: '#00e257' }}>{r.pointCost} ⭐</span> },
  { key: 'stock', label: 'Stok', render: (r) => r.stock === -1 ? '∞' : r.stock },
  { key: 'isActive', label: 'Durum', render: (r) => <span className={`badge badge--${r.isActive ? 'success' : 'danger'}`}>{r.isActive ? 'Aktif' : 'Pasif'}</span> },
];

const Market = () => (
  <CrudPage
    title="Market"
    queryKey="admin-market"
    listFn={getMarketItemsApi}
    createFn={createMarketItemApi}
    updateFn={updateMarketItemApi}
    deleteFn={deleteMarketItemApi}
    fields={fields}
    columns={columns}
  />
);

export default Market;
