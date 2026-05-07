export default function PackSelector({ pack, setPack, basePrice }) {
  const multiplier = { 6: 1, 12: 2, 24: 4 };
  const total = basePrice ? basePrice * multiplier[pack] : 0;

  return (
    <div className="panel">
      <h3>Seleccionar pack</h3>
      <select value={pack} onChange={(e) => setPack(Number(e.target.value))}>
        <option value={6}>Pack x6</option>
        <option value={12}>Pack x12</option>
        <option value={24}>Pack x24</option>
      </select>
      <p>Total calculado: <strong>${total}</strong></p>
    </div>
  );
}
