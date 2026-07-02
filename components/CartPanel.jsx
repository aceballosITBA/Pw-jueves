"use client";

const formatCurrency = (value) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
const getPackPrice = (basePrice, pack) => {
  if (pack === 12) return Math.round(basePrice * 2 * 0.9);
  if (pack === 24) return Math.round(basePrice * 4 * 0.8);
  return basePrice;
};

export default function CartPanel({ items = [], onChangeQuantity, onRemoveItem, onClearCart, onConfirmCart }) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + getPackPrice(item.product.pricePack6, item.pack) * item.quantity, 0);

  const whatsappText = items.length
    ? items.map((item) => `${item.quantity} x ${item.product.name} pack x${item.pack}`).join('%0A')
    : 'Hola, quiero hacer un pedido en Baum.';

  return (
    <aside className="cart-panel" id="carrito">
      <div className="cart-head">
        <div>
          <h2>Carrito</h2>
          <p>{totalItems} producto{totalItems === 1 ? '' : 's'}</p>
        </div>
        <button
          type="button"
          className="clear-filter"
          onClick={() => { if (!items.length) return; if (confirm('¿Vaciar el carrito?')) onClearCart(); }}
          disabled={!items.length}
        >
          Vaciar
        </button>
      </div>

      {!items.length ? (
        <p className="cart-empty">Todavía no agregaste productos. Elegí una cerveza y sumala al carrito.</p>
      ) : (
        <div className="cart-items">
          {items.map((item) => {
            const packPrice = getPackPrice(item.product.pricePack6, item.pack);
            return (
              <article key={`${item.product.id}-${item.pack}`} className="cart-item">
                <div className="cart-item-media">
                  {item.product.images?.[0]
                    ? <img src={item.product.images[0]} alt={item.product.name} className="cart-item-thumb" />
                    : <span style={{fontSize:'.65rem',fontWeight:700,color:'#8b6240'}}>BAUM</span>}
                </div>
                <div>
                  <p className="cart-item-title">{item.product.name}</p>
                  <p className="cart-item-meta">Pack x{item.pack} · {formatCurrency(packPrice)}</p>
                  <p className="cart-item-subtotal">{formatCurrency(packPrice * item.quantity)}</p>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-control">
                    <button type="button" onClick={() => onChangeQuantity(item.product.id, item.pack, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => onChangeQuantity(item.product.id, item.pack, item.quantity + 1)}>+</button>
                  </div>
                  <button type="button" className="cart-remove" onClick={() => onRemoveItem(item.product.id, item.pack)}>quitar</button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="cart-summary">
        <div>
          <p className="cart-summary-label">Total estimado</p>
          <p className="cart-summary-value">{formatCurrency(totalPrice)}</p>
        </div>
        <div className="cart-actions">
          <button type="button" className="cart-confirm" onClick={() => { if (onConfirmCart) onConfirmCart(items); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M20 7H4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 11l-4 4-2-2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Confirmar pedido</span>
          </button>
        </div>
      </div>
    </aside>
  );
}