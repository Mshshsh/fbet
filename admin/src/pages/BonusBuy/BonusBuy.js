import React from 'react';
import CrudPage from '../../components/common/CrudPage';
import { getBonusBuysApi, createBonusBuyApi, updateBonusBuyApi, deleteBonusBuyApi } from '../../api';

const fields = [
  { name: 'gameName', label: 'Oyun Adı', required: true },
  { name: 'provider', label: 'Sağlayıcı' },
  { name: 'betAmount', label: 'Bahis Miktarı', type: 'number', defaultValue: 0 },
  { name: 'costAmount', label: 'Satın Alma Maliyeti', type: 'number', defaultValue: 0 },
  { name: 'resultAmount', label: 'Sonuç Miktarı', type: 'number', defaultValue: 0 },
  { name: 'multiplier', label: 'Çarpan', type: 'number', defaultValue: 0 },
  { name: 'imageUrl', label: 'Resim URL' },
  { name: 'date', label: 'Tarih', type: 'datetime-local' },
];

const columns = [
  { key: 'id', label: '#' },
  { key: 'gameName', label: 'Oyun' },
  { key: 'provider', label: 'Sağlayıcı' },
  { key: 'betAmount', label: 'Bahis', render: (r) => `${r.betAmount || 0} ₺` },
  { key: 'costAmount', label: 'Maliyet', render: (r) => `${r.costAmount || 0} ₺` },
  { key: 'resultAmount', label: 'Sonuç', render: (r) => `${r.resultAmount || 0} ₺` },
  { key: 'multiplier', label: 'Çarpan', render: (r) => `${r.multiplier || 0}x` },
];

const BonusBuy = () => (
  <CrudPage
    title="Bonus Buy Kayıtları"
    queryKey="admin-bonus-buys"
    listFn={getBonusBuysApi}
    createFn={createBonusBuyApi}
    updateFn={updateBonusBuyApi}
    deleteFn={deleteBonusBuyApi}
    fields={fields}
    columns={columns}
  />
);

export default BonusBuy;
