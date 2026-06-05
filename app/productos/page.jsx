"use client";

import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductFilter from '../../components/ProductFilter';
import ProductList from '../../components/ProductList';
import ProductDetail from '../../components/ProductDetail';
import FloatingWhatsApp from '../../components/FloatingWhatsApp';
import CartPanel from '../../components/CartPanel';

const quickCategories = ['IPA', 'Lager', 'Honey', 'Stout', 'Porter', 'Más vendidas', 'Packs x12', 'Packs x24'];
const formatCurrency = (value) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);

function getPackPrice(basePrice, pack) {
  if (pack === 12) return Math.round(basePrice * 2 * 0.9);
  if (pack === 24) return Math.round(basePrice * 4 * 0.8);
  return basePrice;
}

function getCategoryMatch(product, category) {
  if (!category) return true;
  if (category === 'Más vendidas') return Number(product.ibu) >= 20;
  if (category === 'Packs x12' || category === 'Packs x24') return true;
  return product.style.toLowerCase().includes(category.toLowerCase());
}

export default function ProductosPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPack, setSelectedPack] = useState(6);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch('/api/products').then((response) => response.json()).then((data) => {
      const products = data.data?.products || [];
      setProducts(products);
      if (products.length) setSelectedProduct(products[0]);
    });
  }, []);

  useEffect(() => {
    if (selectedCategory === 'Packs x12') setSelectedPack(12);
    if (selectedCategory === 'Packs x24') setSelectedPack(24);
  }, [selectedCategory]);

  const availableStyles = useMemo(() => [...new Set(products.map((product) => product.style))], [products]);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const styleMatch = selectedStyle ? product.style === selectedStyle : true;
    const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = getCategoryMatch(product, selectedCategory);
    return styleMatch && nameMatch && categoryMatch;
  }), [products, selectedStyle, searchTerm, selectedCategory]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSelectedPack(6);
  };

  const addToCart = async (product, pack = selectedPack) => {
    try {
      const res = await fetch('/api/carrito', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, cantidad: 1, pack }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'No se pudo agregar al carrito.');
        return;
      }
    } catch {
      // Si la API no responde, igual permite agregar
    }
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id && item.pack === pack);
      if (existingItem) {
        return currentItems.map((item) => (item.product.id === product.id && item.pack === pack ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...currentItems, { product, pack, quantity: 1 }];
    });
  };

  const changeQuantity = (productId, pack, quantity) => {
    setCartItems((currentItems) => currentItems
      .map((item) => (item.product.id === productId && item.pack === pack ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0));
  };

  const removeItem = (productId, pack) => {
    setCartItems((currentItems) => currentItems.filter((item) => !(item.product.id === productId && item.pack === pack)));
  };

  const clearCart = () => setCartItems([]);

  const goToCart = () => {
    const cartSection = document.getElementById('carrito');
    cartSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cartSummary = useMemo(() => cartItems.reduce((sum, item) => sum + getPackPrice(item.product.pricePack6, item.pack) * item.quantity, 0), [cartItems]);

  return (
    <div className="app-container">
      <Header />
      <main>
        <section className="catalog-intro card">
          <div>
            <p className="eyebrow">Catálogo Baum</p>
            <h1>Elegí, sumá al carrito y armá tu pedido en el momento.</h1>
            <p>Podés filtrar por estilos, revisar el detalle de cada cerveza y dejar el pedido listo para enviar por WhatsApp.</p>
          </div>
          <div className="intro-stats">
            <article>
              <strong>{products.length}</strong>
              <span>cervezas cargadas</span>
            </article>
            <article>
              <strong>{cartItems.length}</strong>
              <span>ítems en carrito</span>
            </article>
            <article>
              <strong>{formatCurrency(cartSummary)}</strong>
              <span>total estimado</span>
            </article>
          </div>
        </section>

        <section className="quick-categories card">
          <div className="section-head">
            <h2>Catálogo de cervezas Baum</h2>
            <button type="button" onClick={() => setSelectedCategory('')} className="clear-filter">Ver todo</button>
          </div>
          <div className="quick-grid">
            {quickCategories.map((category) => (
              <button key={category} type="button" className={selectedCategory === category ? 'quick-pill active' : 'quick-pill'} onClick={() => setSelectedCategory(category)}>
                {category}
              </button>
            ))}
          </div>
        </section>

        <ProductFilter styles={availableStyles} selectedStyle={selectedStyle} searchTerm={searchTerm} onStyleChange={setSelectedStyle} onSearchChange={setSearchTerm} />
        <ProductList products={filteredProducts} onSelectProduct={handleSelectProduct} onAddToCart={addToCart} />
        <div className="product-workbench">
          <ProductDetail product={selectedProduct} selectedPack={selectedPack} onPackChange={setSelectedPack} onAddToCart={addToCart} onGoToCart={goToCart} />
          <CartPanel items={cartItems} onChangeQuantity={changeQuantity} onRemoveItem={removeItem} onClearCart={clearCart} />
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
