import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Search, Trash2, Plus, Minus, X, Star, Check, Tag, ShieldCheck, Box } from 'lucide-react';

export default function App() {
  // --- State Management ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cart & UI State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Active product modal state
  const [activeImageIndex, setActiveImageIndex] = useState(0); // Image gallery tab inside modal
  const [toastMessage, setToastMessage] = useState('');

  // --- API Integration: Fetch Categories ---
  useEffect(() => {
    fetch('https://dummyjson.com/products/category-list')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  // --- API Integration: Fetch Products ---
  useEffect(() => {
    setLoading(true);
    setError(null);

    let url = 'https://dummyjson.com/products?limit=20';
    
    if (searchQuery.trim() !== '') {
      url = `https://dummyjson.com/products/search?q=${encodeURIComponent(searchQuery)}`;
    } else if (selectedCategory !== 'all') {
      url = `https://dummyjson.com/products/category/${selectedCategory}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Network response failed');
        return res.json();
      })
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedCategory, searchQuery]);

  // Handle opening product modal
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0); // Reset image gallery index to initial thumbnail
  };

  // --- Cart Actions ---
  const addToCart = (product, e) => {
    if (e) e.stopPropagation(); // Prevents modal from opening when clicking inline '+' button

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    setToastMessage(`Added "${product.title.slice(0, 20)}..." to cart`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Derived state calculations
  const totalCartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const totalCartPrice = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  }, [cart]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* --- Header / Navigation --- */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
              S
            </div>
            <span className="font-extrabold text-xl tracking-tight hidden sm:inline">StoreFront</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedCategory('all');
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-sm rounded-xl border border-transparent focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            aria-label="Open Cart"
          >
            <ShoppingCart className="w-5 h-5 text-slate-700" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Category Filters */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Categories</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-all ${
                selectedCategory === 'all' && searchQuery === ''
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Items
            </button>
            {categories.slice(0, 10).map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setSearchQuery(''); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse">
                <div className="w-full h-48 bg-slate-200 rounded-xl mb-4" />
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => openProductModal(product)}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
              >
                <div>
                  <div className="relative w-full h-48 bg-slate-100 rounded-xl overflow-hidden mb-4">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-[11px] font-semibold px-2 py-1 rounded-lg backdrop-blur-md">
                      {product.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-slate-800 text-base truncate" title={product.title}>
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{product.rating}</span>
                    </div>
                  </div>

                  <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Price</span>
                    <span className="text-lg font-black text-slate-900">${product.price}</span>
                  </div>

                  <button
                    onClick={(e) => addToCart(product, e)}
                    className="bg-slate-900 hover:bg-blue-600 text-white p-2.5 rounded-xl transition-colors flex items-center justify-center shadow-md active:scale-95"
                    aria-label="Add to cart"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- PRODUCT DETAIL MODAL --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden z-10 my-8 animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Image Gallery Section */}
              <div className="p-6 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
                <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-white border border-slate-200 mb-4 flex items-center justify-center">
                  <img
                    src={selectedProduct.images?.[activeImageIndex] || selectedProduct.thumbnail}
                    alt={selectedProduct.title}
                    className="w-full h-full object-contain p-4"
                  />
                  {selectedProduct.discountPercentage && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                      -{Math.round(selectedProduct.discountPercentage)}% OFF
                    </span>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {selectedProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-white shrink-0 transition-all ${
                          activeImageIndex === idx
                            ? 'border-blue-600 scale-105 shadow-sm'
                            : 'border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info & Actions */}
              <div className="p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  {/* Category & Brand Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      {selectedProduct.category}
                    </span>
                    {selectedProduct.brand && (
                      <span className="text-xs font-semibold text-slate-400">
                        • {selectedProduct.brand}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">
                    {selectedProduct.title}
                  </h2>

                  {/* Rating & Stock Badges */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg border border-amber-200 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{selectedProduct.rating} / 5</span>
                    </div>

                    {/* Stock Status Logic */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <Box className="w-4 h-4 text-slate-400" />
                      {selectedProduct.stock > 10 ? (
                        <span className="text-emerald-600">{selectedProduct.stock} units available</span>
                      ) : selectedProduct.stock > 0 ? (
                        <span className="text-amber-600 font-bold">Low Stock: Only {selectedProduct.stock} left!</span>
                      ) : (
                        <span className="text-red-600 font-bold">Out of Stock</span>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Footer Action & Pricing */}
                <div className="pt-6 border-t border-slate-100">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-3xl font-black text-slate-900">
                      ${selectedProduct.price}
                    </span>
                    {selectedProduct.discountPercentage && (
                      <span className="text-sm text-slate-400 line-through font-medium">
                        ${(selectedProduct.price * (1 + selectedProduct.discountPercentage / 100)).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null); // Close modal after adding
                    }}
                    disabled={selectedProduct.stock === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- Slide-Over Cart Drawer --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          />

          <aside className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  {totalCartCount}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Your shopping cart is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200/80 items-center">
                    <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover rounded-lg bg-white p-1" />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">{item.title}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">${item.price} each</p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 bg-white hover:bg-slate-200 rounded-md border border-slate-300 text-slate-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-800 px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 bg-white hover:bg-slate-200 rounded-md border border-slate-300 text-slate-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-extrabold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors mt-2"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
                <div className="flex justify-between items-center text-slate-600 text-sm">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900 text-lg">${totalCartPrice}</span>
                </div>
                <button
                  onClick={() => alert(`Order submitted! Total: $${totalCartPrice}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-98"
                >
                  Checkout Now
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}