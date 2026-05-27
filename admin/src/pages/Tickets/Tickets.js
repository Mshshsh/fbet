import React from 'react';
import CrudPage from '../../components/common/CrudPage';
import { getTicketsApi, createTicketApi, updateTicketApi } from '../../api';

const fields = [
  { name: 'title', label: 'Başlık', required: true },
  { name: 'description', label: 'Açıklama', type: 'textarea' },
  { name: 'prize', label: 'Ödül' },
  { name: 'ticketCost', label: 'Bilet Maliyeti (Puan)', type: 'number', defaultValue: 0 },
  { name: 'maxTickets', label: 'Maksimum Bilet (0=sınırsız)', type: 'number', defaultValue: 0 },
  { name: 'drawDate', label: 'Çekiliş Tarihi', type: 'datetime-local' },
  { name: 'imageUrl', label: 'Resim URL' },
  { name: 'status', label: 'Durum', type: 'select', defaultValue: 'active', options: [
    { value: 'active', label: 'Aktif' },
    { value: 'drawn', label: 'Çekildi' },
    { value: 'cancelled', label: 'İptal' },
  ]},
];

const columns = [
  { key: 'id', label: '#' },
  { key: 'title', label: 'Başlık' },
  { key: 'prize', label: 'Ödül' },
  { key: 'ticketCost', label: 'Maliyet', render: (r) => `${r.ticketCost} ⭐` },
  { key: 'status', label: 'Durum', render: (r) => <span className={`badge badge--${r.status === 'active' ? 'success' : r.status === 'drawn' ? 'info' : 'danger'}`}>{r.status}</span> },
];

const Tickets = () => (
  <CrudPage
    title="Biletler & Çekilişler"
    queryKey="admin-tickets"
    listFn={getTicketsApi}
    createFn={createTicketApi}
    updateFn={updateTicketApi}
    deleteFn={null}
    fields={fields}
    columns={columns}
  />
);

export default Tickets;
