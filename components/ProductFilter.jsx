"use client";

export default function ProductFilter({ styles, selectedStyle, searchTerm, onStyleChange, onSearchChange }) {
  return (
    <section className="card product-filter">
      <h2>Catálogo</h2>
      <div className="filter-grid">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <select value={selectedStyle} onChange={(event) => onStyleChange(event.target.value)}>
          <option value="">Todos los estilos</option>
          {styles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
