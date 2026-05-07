import { useState } from 'react';

export default function OrderForm({ product, selectedPack }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert(`Pedido listo: ${formData.name} solicitó ${selectedPack} unidades de ${product?.name ?? 'producto sin seleccionar'}.`);
      setFormData({ name: '', phone: '', notes: '' });
    }
  };

  return (
    <section className="card">
      <h2>Formulario de pedido</h2>
      <form onSubmit={handleSubmit} className="order-form">
        <label>
          Nombre *
          <input name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <small className="error">{errors.name}</small>}
        </label>
        <label>
          Teléfono *
          <input name="phone" value={formData.phone} onChange={handleChange} />
          {errors.phone && <small className="error">{errors.phone}</small>}
        </label>
        <label>
          Observaciones
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" />
        </label>
        <button type="submit">Enviar pedido</button>
      </form>
    </section>
  );
}
