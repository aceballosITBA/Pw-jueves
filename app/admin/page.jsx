"use client";

import { useEffect, useMemo, useState } from 'react';
import Footer from '../../components/Footer';

const emptyProduct = {
  id: '',
  name: '',
  style: '',
  description: '',
  pricePack6: '',
  abv: '',
  ibu: '',
  srm: '',
  aroma: '',
  flavor: '',
  pairing: '',
  profile: '',
  stock: '',
  images: ''
};

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const headers = useMemo(() => {
    const nextHeaders = { 'content-type': 'application/json' };
    if (token.trim()) nextHeaders['x-admin-token'] = token.trim();
    return nextHeaders;
  }, [token]);

  const loadProducts = async () => {
    const response = await fetch('/api/products');
    const data = await response.json();
    setProducts(data.data?.products || []);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_api_token') || '';
    setToken(savedToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    localStorage.setItem('admin_api_token', token);
  }, [token]);

  useEffect(() => {
    loadProducts().catch(() => setProducts([]));
  }, []);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const startEdit = (product) => {
    setForm({
      ...emptyProduct,
      ...product,
      pricePack6: String(product.pricePack6 ?? ''),
      ibu: String(product.ibu ?? ''),
      srm: String(product.srm ?? ''),
      stock: String(product.stock ?? ''),
      images: Array.isArray(product.images) ? product.images.join('\n') : String(product.images || '')
    });
  };

  const resetForm = () => setForm(emptyProduct);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const payload = {
        ...form,
        pricePack6: Number(form.pricePack6 || 0),
        ibu: Number(form.ibu || 0),
        srm: Number(form.srm || 0),
        stock: Number(form.stock || 0),
        images: String(form.images || '').split('\n').map((item) => item.trim()).filter(Boolean)
      };

      const response = await fetch('/api/products' + (form.id ? `/${form.id}` : ''), {
        method: form.id ? 'PATCH' : 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('No se pudo guardar el producto');

      await loadProducts();
      resetForm();
      setMessage('Producto guardado correctamente.');
    } catch (error) {
      setMessage(error.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('¿Desactivar este producto?')) return;
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) throw new Error('No se pudo desactivar el producto');

      await loadProducts();
      setMessage('Producto desactivado.');
    } catch (error) {
      setMessage(error.message || 'Error al desactivar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-container">
      <main>
        <section className="catalog-section card">
          <p className="eyebrow">Admin</p>
          <h1>Panel de catálogo</h1>
          <p>Este panel permite crear, editar y desactivar productos usando la API interna.</p>

          <label className="checkout-field" style={{ maxWidth: 520 }}>
            <span>Token admin</span>
            <input value={token} onChange={(event) => setToken(event.target.value)} placeholder="ADMIN_API_TOKEN" />
          </label>

          <form className="checkout-form-grid" onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <label className="checkout-field">
              <span>ID</span>
              <input value={form.id} onChange={handleChange('id')} placeholder="slug-producto" />
            </label>
            <label className="checkout-field">
              <span>Nombre</span>
              <input value={form.name} onChange={handleChange('name')} />
            </label>
            <label className="checkout-field">
              <span>Estilo</span>
              <input value={form.style} onChange={handleChange('style')} />
            </label>
            <label className="checkout-field">
              <span>Precio pack x6</span>
              <input value={form.pricePack6} onChange={handleChange('pricePack6')} type="number" />
            </label>
            <label className="checkout-field">
              <span>ABV</span>
              <input value={form.abv} onChange={handleChange('abv')} />
            </label>
            <label className="checkout-field">
              <span>IBU</span>
              <input value={form.ibu} onChange={handleChange('ibu')} type="number" />
            </label>
            <label className="checkout-field">
              <span>SRM</span>
              <input value={form.srm} onChange={handleChange('srm')} type="number" />
            </label>
            <label className="checkout-field">
              <span>Stock</span>
              <input value={form.stock} onChange={handleChange('stock')} type="number" />
            </label>
            <label className="checkout-field checkout-field-wide">
              <span>Descripción</span>
              <textarea rows="3" value={form.description} onChange={handleChange('description')} />
            </label>
            <label className="checkout-field checkout-field-wide">
              <span>Imágenes, una por línea</span>
              <textarea rows="4" value={form.images} onChange={handleChange('images')} />
            </label>
          </form>

          <div className="modal-actions" style={{ marginTop: 16 }}>
            <button className="btn ghost" type="button" onClick={resetForm} disabled={saving}>Limpiar</button>
            <button className="btn primary" type="button" onClick={handleSubmit} disabled={saving}>{form.id ? 'Actualizar' : 'Crear'} producto</button>
          </div>

          {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}
        </section>

        <section className="catalog-section card" style={{ marginTop: 24 }}>
          <div className="section-head">
            <h2>Productos activos</h2>
            <button className="btn ghost" type="button" onClick={loadProducts}>Recargar</button>
          </div>

          <div className="account-order-list">
            {products.map((product) => (
              <article key={product.id} className="account-user-block" style={{ marginBottom: 16 }}>
                <strong>{product.name}</strong>
                <p>{product.style} · {product.id}</p>
                <p>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(product.pricePack6 || 0)} · stock {product.stock}</p>
                <div className="modal-actions">
                  <button className="btn ghost" type="button" onClick={() => startEdit(product)}>Editar</button>
                  <button className="btn ghost" type="button" onClick={() => handleDelete(product.id)}>Desactivar</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}