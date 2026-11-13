import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Check,
  ChevronRight,
  Plus,
  Minus,
  X,
} from "lucide-react";

import { products } from "../Javascript/products";

// Safe localStorage helpers (won't crash on corrupted data)
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

const COLOR_CODES = {
  Black: "#111111",
  White: "#ffffff",
  Gray: "#808080",
  "Light Gray": "#d3d3d3",
  "Charcoal Gray": "#36404a",
  Beige: "#e8d5b7",
  Brown: "#795548",
  Blue: "#2563eb",
  "Light Blue": "#add8e6",
  "Sky Blue": "#87ceeb",
  Red: "#dc2626",
  Purple: "#9333ea",
  Green: "#16a34a",
  "Olive Green": "#808000",
  "Light Green": "#90ee90",
  Orange: "#f97316",
  "Baby Pink": "#f4b6c2",
  "Light Pink": "#f8c8dc",
  Ivory: "#fffff0",
};

const LIGHT_COLORS = [
  "White",
  "Beige",
  "Ivory",
  "Light Pink",
  "Light Gray",
  "Light Blue",
  "Light Green",
  "Baby Pink",
  "Sky Blue",
];

const getColorCode = (color) => COLOR_CODES[color] || "#cccccc";

const formatPrice = (price) => `$${price.toFixed(2)}`;

const Detaill = () => {
  const { id } = useParams();

  // Find product by ID
  const product = products.find((item) => item.id === Number(id));

  // States
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Product images
  const images = product
    ? [...new Set([product.image, ...(product.images || [])].filter(Boolean))]
    : [];

  // Reset state + check wishlist when product changes
  useEffect(() => {
    if (!product) return;

    setSelectedImage(product.image);
    setSelectedSize("");
    setSelectedColor(product.color?.[0] || "");
    setQuantity(1);
    setMessage({ text: "", type: "" });

    const wishlist = readStorage("wishlist");
    setIsFavorite(wishlist.some((item) => item.id === product.id));
  }, [product]);

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">Product Not Found</h1>

        <Link to="/" className="bg-black text-white px-6 py-3 rounded-lg">
          Back to Home
        </Link>
      </div>
    );
  }

  // Calculate discount
  const finalPrice =
    product.price - (product.price * (product.discount || 0)) / 100;

  // Add to cart
  const handleAddToCart = () => {
    if (product.size?.length && !selectedSize) {
      setMessage({ text: "Please select a size first!", type: "error" });
      return;
    }

    if (product.color?.length && !selectedColor) {
      setMessage({ text: "Please select a color first!", type: "error" });
      return;
    }

    const cart = readStorage("cart");

    // Same product + size + color → increase quantity
    const existingItem = cart.find(
      (item) =>
        item.id === product.id &&
        item.size === selectedSize &&
        item.color === selectedColor
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        image: product.image,
        price: finalPrice,
        size: selectedSize,
        color: selectedColor,
        quantity,
      });
    }

    writeStorage("cart", cart);

    window.dispatchEvent(new Event("cartUpdated"));

    setMessage({ text: "Product added to cart successfully!", type: "success" });
  };

  // Wishlist
  const handleFavorite = () => {
    const wishlist = readStorage("wishlist");

    const updatedWishlist = isFavorite
      ? wishlist.filter((item) => item.id !== product.id)
      : [
        ...wishlist,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          price: finalPrice,
        },
      ];

    writeStorage("wishlist", updatedWishlist);
    window.dispatchEvent(new Event("wishlistUpdated"));

    setIsFavorite(!isFavorite);
  };

  return (
    <div className="bg-white min-h-screen pt-24">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT: Images */}
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-[100px] sm:max-h-[620px]">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`shrink-0 w-[75px] h-[90px] sm:w-full sm:h-[120px] rounded overflow-hidden border-2 transition ${selectedImage === img
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-500"
                    }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 bg-gray-100 rounded overflow-hidden">
              {product.isnew && (
                <span className="absolute top-5 left-5 z-10 bg-white text-black text-xs font-semibold px-4 py-2 rounded-full">
                  New Arrival
                </span>
              )}
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="w-full h-[420px] sm:h-[550px] lg:h-[620px] object-cover transition-all duration-300"
              />
            </div>
          </div>

          {/* RIGHT: Product info */}
          <div className="flex flex-col pt-2">
            {/* Brand */}
            <p className="text-sm text-gray-500 tracking-widest font-semibold mb-3">
              {product.brand}
            </p>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex text-black">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      product.rating && star > Math.round(product.rating)
                        ? "text-gray-300"
                        : "text-black"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>

              <span className="text-sm text-gray-500">
                {product.rating ? `${product.rating} / 5` : "Customer favorite"}
              </span>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <span className="text-3xl font-bold">{formatPrice(finalPrice)}</span>

              {product.discount > 0 && (
                <>
                  <span className="text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>

                  <span className="bg-black text-white text-xs px-3 py-2 rounded-md font-bold">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-7 mt-5">{product.description}</p>

            <div className="border-t border-gray-200 my-6" />

            {/* Color Selection */}
            {product.color?.length > 0 && (
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-semibold">Color:</span>
                  <span className="text-gray-600">{selectedColor}</span>
                </div>

                <div className="flex flex-wrap gap-4">
                  {product.color.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      aria-label={color}
                      className={`w-20 h-10 rounded flex items-center justify-center border-2 transition ${selectedColor === color
                          ? "border-black ring-2 ring-gray-300 ring-offset-2"
                          : "border-gray-200"
                        }`}
                      style={{ backgroundColor: getColorCode(color) }}
                    >
                      {selectedColor === color && (
                        <Check
                          size={17}
                          className={
                            LIGHT_COLORS.includes(color)
                              ? "text-black"
                              : "text-white"
                          }
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.size?.length > 0 && (
              <div className="mb-7">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">
                    Size:{" "}
                    <span className="text-gray-500">
                      {selectedSize || "Select size"}
                    </span>
                  </span>

                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="flex items-center gap-2 text-sm underline text-gray-600 hover:text-black"
                  >
                    <Ruler size={17} />
                    Size Guide
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {product.size.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedSize(size);
                        setMessage({ text: "", type: "" });
                      }}
                      className={`min-w-[55px] h-11 px-4 rounded-lg border font-semibold transition ${selectedSize === size
                          ? "bg-black text-white border-black"
                          : "border-gray-300 hover:border-black"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="font-semibold mb-3">Quantity</p>

              <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  aria-label="Decrease quantity"
                  className="p-3 hover:bg-gray-100"
                >
                  <Minus size={17} />
                </button>

                <span className="w-12 text-center font-semibold">{quantity}</span>

                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  aria-label="Increase quantity"
                  className="p-3 hover:bg-gray-100"
                >
                  <Plus size={17} />
                </button>
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <p
                className={`text-sm mb-4 ${message.type === "success" ? "text-green-600" : "text-red-500"
                  }`}
              >
                {message.text}
              </p>
            )}

            {/* Add To Cart & Wishlist */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-4 rounded-xl flex items-center justify-center gap-3 font-semibold hover:bg-gray-800 transition"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              <button
                onClick={handleFavorite}
                aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                className="w-14 border border-gray-300 rounded-xl flex items-center justify-center hover:border-black transition"
              >
                <Heart
                  size={22}
                  className={
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
                  }
                />
              </button>
            </div>

            {/* Shipping Information */}
            <div className="grid grid-cols-3 gap-3 mt-8 border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row gap-2 items-center sm:items-start">
                <Truck size={21} />
                <div className="text-center sm:text-left">
                  <p className="text-xs font-semibold">Free Shipping</p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    On orders over $99
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 items-center sm:items-start">
                <RotateCcw size={21} />
                <div className="text-center sm:text-left">
                  <p className="text-xs font-semibold">Easy Returns</p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    30-day return policy
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 items-center sm:items-start">
                <ShieldCheck size={21} />
                <div className="text-center sm:text-left">
                  <p className="text-xs font-semibold">Secure Payment</p>
                  <p className="text-[10px] text-gray-500 mt-1">Secure checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowSizeGuide(false)}
              aria-label="Close size guide"
              className="absolute top-4 right-4"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold mb-2">Size Guide</h2>

            <p className="text-gray-500 text-sm mb-5">
              Available sizes for {product.name}
            </p>

            <div className="grid grid-cols-3 gap-3">
              {product.size?.map((size, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 text-center rounded-lg font-semibold"
                >
                  {size}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowSizeGuide(false)}
              className="w-full bg-black text-white py-3 rounded-lg mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detaill;