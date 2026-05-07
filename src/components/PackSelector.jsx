export default function PackSelector({ selectedPack, onPackChange, basePrice }) {
  const multiplier = { 6: 1, 12: 2, 24: 4 };
  const totalPrice = basePrice * multiplier[selectedPack];

  return (
    <section className="panel">
      <h3>Seleccionar pack</h3>
      <select value={selectedPack} onChange={(event) => onPackChange(Number(event.target.value))}>
        <option value={6}>Pack x6</option>
        <option value={12}>Pack x12</option>
        <option value={24}>Pack x24</option>
      </select>
      <p>Total calculado: <strong>${totalPrice}</strong></p>
    </section>
  );
}
