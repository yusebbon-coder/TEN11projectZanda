import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
const DELIVERY_FEE = 2;

// Safe localStorage helpers
const readStorage = (key) => {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
};

const writeStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Could not save ${key}:`, error);
    }
};

// Same product + size + color = same cart line
const itemKey = (item) => `${item.id}-${item.size}-${item.color}`;

const formatPrice = (price) => `$${price.toFixed(2)}`;

const CartDrawer = ({ open, onClose }) => {
    const [items, setItems] = useState([]);

    // Load cart + listen for changes
    useEffect(() => {
        const loadCart = () => setItems(readStorage("cart"));

        loadCart();
        window.addEventListener("cartUpdated", loadCart);
        window.addEventListener("storage", loadCart);

        return () => {
            window.removeEventListener("cartUpdated", loadCart);
            window.removeEventListener("storage", loadCart);
        };
    }, []);

    // Lock page scroll + close with Escape key
    useEffect(() => {
        if (!open) return;

        const handleKey = (e) => e.key === "Escape" && onClose();
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKey);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKey);
        };
    }, [open, onClose]);

    // Save + tell Navbar badge to update
    const saveCart = (updated) => {
        writeStorage("cart", updated);
        setItems(updated);
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const changeQuantity = (key, amount) => {
        const updated = items.map((item) =>
            itemKey(item) === key
                ? { ...item, quantity: Math.max(1, item.quantity + amount) }
                : item
        );
        saveCart(updated);
    };

    const removeItem = (key) => {
        saveCart(items.filter((item) => itemKey(item) !== key));
    };

    // Totals
    const subtotal = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
    const delivery = items.length > 0 ? DELIVERY_FEE : 0;
    const total = subtotal + delivery;

    return (
        <>
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            />
            <aside
                className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
                    }`}
                aria-hidden={!open}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShoppingCart size={22} />
                        My Bag ({items.reduce((n, item) => n + item.quantity, 0)})
                    </h2>

                    <button
                        onClick={onClose}
                        aria-label="Close cart"
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-gray-500">
                            <ShoppingCart size={56} strokeWidth={1.2} />
                            <p className="font-semibold text-gray-800">Your bag is empty</p>
                            <button
                                onClick={onClose}
                                className="mt-2 bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-5">
                            {items.map((item) => {
                                const key = itemKey(item);

                                return (
                                    <li key={key} className="flex gap-4">
                                        {/* Image */}
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-24 h-28 object-cover rounded-lg bg-gray-100 shrink-0"
                                        />

                                        {/* Info */}
                                        <div className="flex-1 min-w-0 flex flex-col">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                                                    {item.name}
                                                </h3>

                                                <button
                                                    onClick={() => removeItem(key)}
                                                    aria-label={`Remove ${item.name}`}
                                                    className="text-gray-400 hover:text-red-500 transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            <p className="text-xs text-gray-500 mt-1">
                                                Color: <span className="text-gray-800">{item.color || "-"}</span>
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Size: <span className="text-gray-800">{item.size || "-"}</span>
                                            </p>

                                            <div className="flex items-center justify-between mt-auto pt-2">
                                                {/* Quantity */}
                                                <div className="flex items-center border border-gray-300 rounded-lg">
                                                    <button
                                                        onClick={() => changeQuantity(key, -1)}
                                                        aria-label="Decrease quantity"
                                                        className="p-2 hover:bg-gray-100"
                                                    >
                                                        <Minus size={14} />
                                                    </button>

                                                    <span className="w-8 text-center text-sm font-semibold">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() => changeQuantity(key, 1)}
                                                        aria-label="Increase quantity"
                                                        className="p-2 hover:bg-gray-100"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                {/* Line price */}
                                                <span className="font-bold">
                                                    {formatPrice(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Footer: totals + checkout */}
                {items.length > 0 && (
                    <div className="border-t px-5 py-5 bg-white">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>

                        <div className="flex justify-between text-sm text-gray-600 mb-3">
                            <span>Delivery</span>
                            <span>{formatPrice(delivery)}</span>
                        </div>

                        <div className="flex justify-between text-lg font-bold border-t pt-3 mb-4">
                            <span>Total Payment</span>
                            <span>{formatPrice(total)}</span>
                        </div>

                        <Link
                            to="/checkout"
                            onClick={onClose}
                            className="w-full bg-black text-white py-4 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-gray-800 transition"
                        >
                            Check Out
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                )}
            </aside>
        </>
    );
};

export default CartDrawer;