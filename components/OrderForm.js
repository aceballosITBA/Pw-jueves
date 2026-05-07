import { useState } from 'react';

export default function OrderForm({ products, selectedProduct, pack }) {
  const [form, setForm] = useState({ name: '', phone: '', productId: selectedProduct?.id || '', pack: pack || '', notes: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'El nombre es obligatorio';
    if (!form.phone.trim()) nextErrors.phone = 'El teléfono es obligatorio';
    if (!form.productId) nextErrors.productId = 'Elegí un producto';
    if (!form.pack) nextErrors.pack = 'Elegí un pack';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      alert('Pedido enviado (simulado).');
    }
  };

  return (
    <section className="form-section">
      <h3>Formulario de pedido</h3>
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input name="name" value={form.name} onChange={handleChange} />
        {errors.name && <p className="error">{errors.name}</p>}

        <label>Teléfono</label>
        <input name="phone" value={form.phone} onChange={handleChange} />
        {errors.phone && <p className="error">{errors.phone}</p>}

        <label>Producto</label>
        <select name="productId" value={form.productId} onChange={handleChange}>
          <option value="">Seleccionar</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {errors.productId && <p className="error">{errors.productId}</p>}

        <label>Pack</label>
        <select name="pack" value={form.pack} onChange={handleChange}>
          <option value="">Seleccionar</option>
          <option value="6">Pack x6</option>
          <option value="12">Pack x12</option>
          <option value="24">Pack x24</option>
        </select>
        {errors.pack && <p className="error">{errors.pack}</p>}

        <label>Observaciones</label>
        <textarea name="notes" rows="3" value={form.notes} onChange={handleChange} />

        <button className="btn" type="submit">Enviar pedido</button>
      </form>
    </section>
  );
}
