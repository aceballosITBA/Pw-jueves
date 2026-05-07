import { useEffect, useState } from 'react';

export default function OrderForm({ products, selectedProduct, selectedPack }) {
  const [formData, setFormData] = useState({ name: '', phone: '', productId: '', pack: '', notes: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      productId: selectedProduct ? String(selectedProduct.id) : prev.productId,
      pack: String(selectedPack)
    }));
  }, [selectedProduct, selectedPack]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = 'El nombre es obligatorio';
    if (!formData.phone.trim()) nextErrors.phone = 'El teléfono es obligatorio';
    if (!formData.productId) nextErrors.productId = 'El producto es obligatorio';
    if (!formData.pack) nextErrors.pack = 'El pack es obligatorio';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      alert('Pedido enviado (simulado)');
    }
  };

  return (
    <section className="form-section">
      <h3>Formulario de pedido</h3>
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input name="name" value={formData.name} onChange={handleChange} />
        {errors.name && <p className="error">{errors.name}</p>}

        <label>Teléfono</label>
        <input name="phone" value={formData.phone} onChange={handleChange} />
        {errors.phone && <p className="error">{errors.phone}</p>}

        <label>Producto</label>
        <select name="productId" value={formData.productId} onChange={handleChange}>
          <option value="">Seleccionar</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>
        {errors.productId && <p className="error">{errors.productId}</p>}

        <label>Pack</label>
        <select name="pack" value={formData.pack} onChange={handleChange}>
          <option value="">Seleccionar</option>
          <option value="6">Pack x6</option>
          <option value="12">Pack x12</option>
          <option value="24">Pack x24</option>
        </select>
        {errors.pack && <p className="error">{errors.pack}</p>}

        <label>Observaciones</label>
        <textarea name="notes" rows="3" value={formData.notes} onChange={handleChange} />

        <button type="submit" className="btn">Enviar pedido</button>
      </form>
    </section>
  );
}
