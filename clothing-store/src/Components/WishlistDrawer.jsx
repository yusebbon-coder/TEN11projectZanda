import React, { useState, useEffect } from "react";
import { X, Heart, Trash2 } from "lucide-react";

const readStorage = (key) => {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
};

const WishlistDrawer = ({ open, onClose }) => {
    const [items, setItems] = useState([]);

    // Reload items whenever the drawer opens or the wishlist changes
    useEffect(() => {
        const load = () => setItems(readStorage("wishlist"));
        load();

        window.addEventListener("wishlistUpdated", load);
        window.addEventListener("storage", load);
        return () => {
            window.removeEventListener("wishlistUpdated", load);
            window.removeEventListener("storage", load);
        };
    }, [open]);

    // Lock page scroll while the drawer is open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const removeItem = (id) => {
        const updated = readStorage("wishlist").filter((item) => item.id !== id);
        localStorage.setItem("wishlist", JSON.stringify(updated));
        setItems(updated);
        window.dispatchEvent(new Event("wishlistUpdated")); // updates Navbar badge
    };

    return (
        <>
            {/* Dark overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            />

            {/* Right slide panel */}
            <aside
                className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Heart size={22} className="text-red-500 fill-red-500" />
                        Wishlist ({items.length})
                    </h2>
                    <button onClick={onClose} aria-label="Close wishlist">
                        <X size={26} />
                    </button>
                </div>

                {/* Big product cards */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <Heart size={56} />
                            <p className="mt-4 text-lg">Your wishlist is empty</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.id}
                                className="rounded overflow-hidden  hover:shadow-lg transition"
                            >
                                {/* Big image */}
                                <div className="relative">
                                    <img
                                        src={item.image || item.img}
                                        alt={item.name || item.title}
                                        className="w-full h-72 object-cover"
                                    />
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        aria-label="Remove from wishlist"
                                        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-red-500 hover:text-white transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold">
                                        {item.name || item.title}
                                    </h3>
                                    {item.category && (
                                        <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                                    )}
                                    <p className="text-xl font-bold mt-2">${item.price}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </aside>
        </>
    );
};

export default WishlistDrawer;