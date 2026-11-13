import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Heart, ShoppingCart, User } from "lucide-react";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";
import AuthModal from "./Authmodal.jsx";
import { products } from "../Javascript/products";
const readStorage = (key) => {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};
const readCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    return null;
  }
};
// Search dropdown: cards if match, "No Product" text if not
const SearchResults = ({ query, search, results, onSelect, className = "" }) => {
  if (!query) return null;
  return (
    <div
      className={`bg-white border rounded-xl shadow-lg p-3 max-h-96 overflow-y-auto ${className}`}
    >
      {results.length > 0 ? (
        <div className="flex flex-col gap-2">
          {results.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`} // change to your Detail page route
              onClick={onSelect}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-14 h-14 object-cover rounded-lg"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-sm text-gray-500">${p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500 py-4">
          No Product "<span className="font-medium text-black">{search}</span>"
        </p>
      )}
    </div>
  );
};

const Navbar = () => {
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Auth
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [currentUser, setCurrentUser] = useState(null);

  // Search: input -> filter data
  const query = search.trim().toLowerCase();
  const results = query
    ? products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
    )
    : [];
  const clearSearch = () => setSearch("");

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthOpen(true);
    setMenuOpen(false);
  };

  useEffect(() => {
    const updateCounts = () => {
      const cart = readStorage("cart");
      setCartCount(cart.reduce((total, item) => total + (item.quantity || 1), 0));
      setWishlistCount(readStorage("wishlist").length);
    };

    const updateUser = () => setCurrentUser(readCurrentUser());

    updateCounts();
    updateUser();

    window.addEventListener("cartUpdated", updateCounts);
    window.addEventListener("wishlistUpdated", updateCounts);
    window.addEventListener("authUpdated", updateUser);
    window.addEventListener("storage", updateCounts);
    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("cartUpdated", updateCounts);
      window.removeEventListener("wishlistUpdated", updateCounts);
      window.removeEventListener("authUpdated", updateUser);
      window.removeEventListener("storage", updateCounts);
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="text-3xl font-black tracking-tight">
              ZAN<span className="text-black">DA</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-7 font-medium">
              <Link to="/" className="hover:text-yellow-500">Home</Link>
              <Link to="/men" className="hover:text-yellow-500">Men</Link>
              <Link to="/women" className="hover:text-yellow-500">Women</Link>
              <Link to="/accessory" className="hover:text-yellow-500">Accessory</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Search (desktop) */}
              <div className="relative hidden lg:block">
                <div className="flex items-center border rounded-full px-4 py-2 w-64">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full outline-none text-sm"
                  />
                  <span>⌕</span>
                </div>

                <SearchResults
                  query={query}
                  search={search}
                  results={results}
                  onSelect={clearSearch}
                  className="absolute top-full right-0 mt-2 w-80"
                />
              </div>

              {/* Wishlist */}
              <button
                onClick={() => setWishlistOpen(true)}
                aria-label="Open wishlist"
                className="relative"
              >
                <Heart size={23} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                aria-label="Open cart"
                className="relative"
              >
                <ShoppingCart size={23} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* Auth (desktop): Account icon when logged in */}
              {currentUser ? (
                <Link
                  to="/account"
                  aria-label="My account"
                  title="My account"
                  className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-black text-white hover:bg-gray-800 transition"
                >
                  <User size={18} />
                </Link>
              ) : (
                <div className="hidden sm:flex items-center gap-3">
                  <button
                    onClick={() => openAuth("login")}
                    className="font-medium hover:text-yellow-500"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openAuth("register")}
                    className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden mt-4 border-t pt-4 flex flex-col gap-4">
              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/men" onClick={() => setMenuOpen(false)}>Men</Link>
              <Link to="/women" onClick={() => setMenuOpen(false)}>Women</Link>
              <Link to="/accessory" onClick={() => setMenuOpen(false)}>Accessory</Link>

              {currentUser ? (
                <Link
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                  aria-label="My account"
                  className="flex items-center justify-center gap-2 px-5 py-2 border text-white bg-black"
                >
                  <User size={18} />
                  Account
                </Link>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => openAuth("login")}
                    className="flex-1 px-5 py-2 border text-center"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openAuth("register")}
                    className="flex-1 px-5 py-2 border text-white bg-black text-center"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Search (mobile) */}
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg px-3 py-2 outline-none"
              />

              <SearchResults
                query={query}
                search={search}
                results={results}
                onSelect={() => {
                  clearSearch();
                  setMenuOpen(false);
                }}
              />
            </div>
          )}
        </div>
      </nav>

      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal
        open={authMode ? authOpen : false}
        mode={authMode}
        setMode={setAuthMode}
        onClose={() => setAuthOpen(false)}
      />
    </div>
  );
};

export default Navbar;