import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";

const CartPage = () => {

    const [cart, setCart] = useState(() =>
        JSON.parse(localStorage.getItem("cart") || "[]")
    );

    // Save Cart
    const updateCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    // Increase Quantity
    const increase = (index) => {
        const newCart = [...cart];
        newCart[index].quantity += 1;
        updateCart(newCart);
    };

    // Decrease Quantity
    const decrease = (index) => {
        const newCart = [...cart];

        if (newCart[index].quantity > 1) {
            newCart[index].quantity -= 1;
        }

        updateCart(newCart);
    };

    // Remove Product
    const removeProduct = (index) => {
        const newCart = cart.filter(
            (_, i) => i !== index
        );

        updateCart(newCart);
    };

    // Total Price
    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">

            <h1 className="text-3xl font-bold mb-8">
                Shopping Cart
            </h1>

            {cart.length === 0 ? (

                <div className="text-center py-20">

                    <h2 className="text-2xl font-semibold">
                        Your Cart is Empty
                    </h2>

                    <p className="text-gray-500 mt-3">
                        You haven't added any products yet.
                    </p>

                    <Link
                        to="/"
                        className="inline-block mt-6 bg-black text-white px-7 py-3 rounded-lg"
                    >
                        Continue Shopping
                    </Link>

                </div>

            ) : (

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-5">
                        {cart.map((item, index) => (

                            <div
                                key={`${item.id}-${item.size}-${item.color}`}
                                className="flex gap-4 border-b pb-5"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-28 h-32 object-cover rounded-xl bg-gray-100"
                                />

                                <div className="flex-1">

                                    <h3 className="font-semibold">
                                        {item.name}
                                    </h3>

                                    <p className="text-gray-500 text-sm mt-2">
                                        Size: {item.size}
                                    </p>

                                    <p className="text-gray-500 text-sm">
                                        Color: {item.color}
                                    </p>

                                    <p className="font-bold mt-2">
                                        ${item.price.toFixed(2)}
                                    </p>

                                    <div className="flex items-center justify-between mt-4">

                                        <div className="flex items-center border rounded-lg">

                                            <button
                                                onClick={() => decrease(index)}
                                                className="p-2"
                                            >
                                                <Minus size={15} />
                                            </button>

                                            <span className="px-3">
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() => increase(index)}
                                                className="p-2"
                                            >
                                                <Plus size={15} />
                                            </button>

                                        </div>

                                        <button
                                            onClick={() => removeProduct(index)}
                                            className="text-red-500"
                                        >
                                            <Trash2 size={20} />
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 h-fit">
                        <h2 className="text-xl font-bold mb-6">
                            Order Summary
                        </h2>
                        <div className="flex justify-between mb-4">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <hr className="my-5" />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button className="w-full bg-black text-white py-4 rounded-xl mt-7 hover:bg-gray-800">
                            Checkout
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CartPage;