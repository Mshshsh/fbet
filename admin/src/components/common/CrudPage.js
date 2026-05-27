import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Generic CRUD sayfası bileşeni
 * Props:
 *   title, queryKey, listFn, createFn, updateFn, deleteFn,
 *   fields: [{ name, label, type, options, required }],
 *   columns: [{ key, label, render }]
 */
const CrudPage = ({ title, queryKey, listFn, createFn, updateFn, deleteFn, fields, columns }) => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [alert, setAlert] = useState('');

  const showAlert = (msg) => { setAlert(msg); setTimeout(() => setAlert(''), 3000); };

  const { data, isLoading } = useQuery({ queryKey: [queryKey], queryFn: listFn });
  const items = data?.data?.data || [];

  const buildInitial = () => {
    const init = {};
    fields.forEach((f) => { init[f.name] = f.defaultValue ?? ''; });
    return init;
  };

  const handleOpenCreate = () => {
    setEditing(null);
    setFormData(buildInitial());
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditing(item);
    const init = {};
    fields.forEach((f) => { init[f.name] = item[f.name] ?? f.defaultValue ?? ''; });
    setFormData(init);
    setShowForm(true);
  };

  const createMut = useMutation({
    mutationFn: (data) => createFn(data),
    onSuccess: () => { showAlert('✅ Oluşturuldu.'); qc.invalidateQueries([queryKey]); setShowForm(false); },
    onError: (e) => showAlert('❌ ' + (e.response?.data?.error || 'Hata')),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateFn(id, data),
    onSuccess: () => { showAlert('✅ Güncellendi.'); qc.invalidateQueries([queryKey]); setShowForm(false); },
    onError: (e) => showAlert('❌ ' + (e.response?.data?.error || 'Hata')),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => deleteFn(id),
    onSuccess: () => { showAlert('✅ Silindi.'); qc.invalidateQueries([queryKey]); },
    onError: (e) => showAlert('❌ ' + (e.response?.data?.error || 'Hata')),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      updateMut.mutate({ id: editing.id, data: formData });
    } else {
      createMut.mutate(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const renderField = (field) => {
    if (field.type === 'checkbox') {
      return (
        <div key={field.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <input type="checkbox" name={field.name} checked={!!formData[field.name]} onChange={handleChange} />
          <label style={{ fontSize: 13, color: '#c0c4d0' }}>{field.label}</label>
        </div>
      );
    }
    if (field.type === 'select') {
      return (
        <div key={field.name} className="form-group">
          <label>{field.label}</label>
          <select name={field.name} value={formData[field.name] || ''} onChange={handleChange}>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      );
    }
    if (field.type === 'textarea') {
      return (
        <div key={field.name} className="form-group">
          <label>{field.label}</label>
          <textarea name={field.name} value={formData[field.name] || ''} onChange={handleChange} />
        </div>
      );
    }
    return (
      <div key={field.name} className="form-group">
        <label>{field.label}{field.required && ' *'}</label>
        <input
          type={field.type || 'text'}
          name={field.name}
          value={formData[field.name] || ''}
          onChange={handleChange}
          required={field.required}
          placeholder={field.placeholder || ''}
        />
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        {createFn && (
          <button className="btn-primary" onClick={handleOpenCreate}>+ Yeni Ekle</button>
        )}
      </div>
      {alert && <div className={`alert ${alert.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{alert}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            {editing ? 'Düzenle' : 'Yeni Ekle'}
          </h3>
          <form onSubmit={handleSubmit}>
            {fields.map(renderField)}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button type="submit" className="btn-primary" disabled={createMut.isPending || updateMut.isPending}>
                {editing ? 'Güncelle' : 'Kaydet'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>İptal</button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? <div className="loading">Yükleniyor...</div> : (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((c) => <th key={c.key}>{c.label}</th>)}
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={columns.length + 1} style={{ textAlign: 'center', color: '#8a8fa8', padding: 32 }}>Kayıt yok.</td></tr>
              ) : items.map((item) => (
                <tr key={item.id}>
                  {columns.map((c) => (
                    <td key={c.key}>{c.render ? c.render(item) : item[c.key]}</td>
                  ))}
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {updateFn && (
                        <button className="btn-secondary btn-sm" onClick={() => handleEdit(item)}>Düzenle</button>
                      )}
                      {deleteFn && (
                        <button
                          className="btn-danger btn-sm"
                          onClick={() => window.confirm('Silmek istediğinize emin misiniz?') && deleteMut.mutate(item.id)}
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CrudPage;
