export default function ProductFilter({ query, onChange }) {
  const isValid = query.length <= 30;

  return (
    <section className="filter">
      <label htmlFor="search">Buscar producto</label>
      <input
        id="search"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ej: IPA"
      />
      {!isValid && <small className="error">Máximo 30 caracteres.</small>}
    </section>
  );
}
