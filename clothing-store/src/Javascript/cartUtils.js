export const getCart = () => {
  try {
    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));

  window.dispatchEvent(new Event("cartUpdated"));
};

export const getCartCount = () => {
  return getCart().reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );
};

export const getCartTotal = () => {
  return getCart().reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
};

export const addToCart = (product, options) => {
  const cart = getCart();

  const existingIndex = cart.findIndex(
    (item) =>
      item.id === product.id &&
      item.size === options.size &&
      item.color === options.color
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += options.quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      image: product.image,
      price: product.price,
      size: options.size,
      color: options.color,
      quantity: options.quantity,
    });
  }

  saveCart(cart);
};