import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Truck, Landmark, CreditCard, CheckCircle2 } from "lucide-react";

const DELIVERY_FEE = 2;

// ---------- Safe localStorage helpers ----------
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

const itemKey = (item) => `${item.id}-${item.size}-${item.color}`;
const formatPrice = (price) => `$${price.toFixed(2)}`;

// ---------- Payment methods ----------
// QR images go in: public/images/aba-qr.png and public/images/acleda-qr.png
const PAYMENT_METHODS = [
    {
        id: "cod",
        label: "Pay on delivery",
        note: "Pay cash when your order arrives.",
        icon: Truck,
        qr: null,
    },
    {
        id: "aba",
        label: "Pay with ABA",
        note: "Scan the ABA QR code after you press Check Now.",
        icon: Landmark,
        qr: "/images/image.jpg",
    },
    {
        id: "acleda",
        label: "Pay with ACLEDA",
        note: "Scan the ACLEDA QR code after you press Check Now.",
        icon: CreditCard,
        qr: "/images/imagee.jpg",
    },
];

// ---------- Validation ----------
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Cambodian numbers: 012345678, 0123456789 or +855123456789
const isValidPhone = (v) => /^(\+855|0)\d{8,9}$/.test(v.replace(/[\s-]/g, ""));

const isValidMapLink = (v) => {
    try {
        const url = new URL(v.trim());
        const host = url.hostname.replace("www.", "");
        const isShortLink = host === "maps.app.goo.gl" || host === "goo.gl";
        const isMapsDomain = host === "maps.google.com";
        const isGoogleMapsPath = host.startsWith("google.") && url.pathname.startsWith("/maps");
        return isShortLink || isMapsDomain || isGoogleMapsPath;
    } catch {
        return false;
    }
};

const validate = (form) => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Enter your full name.";
    if (!isValidEmail(form.email.trim())) errors.email = "Enter a valid email address.";
    if (!isValidPhone(form.phone)) errors.phone = "Enter a valid phone number, e.g. 012 345 678.";
    if (!form.location.trim()) errors.location = "Enter your delivery address.";
    if (!isValidMapLink(form.mapLink)) errors.mapLink = "Paste a Google Maps link, e.g. https://maps.app.goo.gl/...";
    return errors;
};

const Field = ({ label, error, children }) => (
    <label className="block">
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        <div className="mt-1">{children}</div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </label>
);

const inputClass = (error) =>
    `w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-black ${error ? "border-red-400" : "border-gray-300"
    }`;

// QR image with a fallback if the file is missing
const QrImage = ({ src, alt }) => {
    const [failed, setFailed] = useState(false);

    // Reset when the bank (image) changes, so one missing file never hides the other QR
    useEffect(() => {
        setFailed(false);
    }, [src]);

    if (failed) {
        return (
            <div className="w-64 h-64 mx-auto rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 text-xs text-center px-4 gap-2">
                <img src="/images/image.jpg" alt="" className="w-20 h-20 object-contain" />
                QR image not found. Add it to <span className="font-mono">{src}</span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            onError={() => setFailed(true)}
            className="w-64 h-64 mx-auto object-contain rounded-xl border border-gray-200 bg-white p-2"
        />
    );
};

const Checkout = () => {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", mapLink: "" });
    const [payment, setPayment] = useState("cod");
    const [errors, setErrors] = useState({});

    // step: "form" -> "qr" (ABA / ACLEDA only) -> "thanks"
    const [step, setStep] = useState("form");
    const [pendingOrder, setPendingOrder] = useState(null);
    const [placedOrder, setPlacedOrder] = useState(null);

    useEffect(() => {
        setItems(readStorage("cart"));
    }, []);

    const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
    const delivery = items.length > 0 ? DELIVERY_FEE : 0;
    const total = subtotal + delivery;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    // Save order, clear cart, update Navbar badge, show Thank You
    const finalizeOrder = (order, paymentStatus) => {
        const finalOrder = { ...order, paymentStatus };

        writeStorage("orders", [...readStorage("orders"), finalOrder]);
        writeStorage("cart", []);
        window.dispatchEvent(new Event("cartUpdated"));

        setItems([]);
        setPlacedOrder(finalOrder);
        setStep("thanks");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // "Check Now" button
    const handleSubmit = (e) => {
        e.preventDefault();

        const found = validate(form);
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        const order = {
            id: `ZD-${Date.now()}`,
            date: new Date().toISOString(),
            customer: { ...form, phone: form.phone.replace(/[\s-]/g, "") },
            payment,
            items,
            subtotal,
            delivery,
            total,
        };

        if (payment === "cod") {
            // Pay on delivery: no QR, go straight to Thank You
            finalizeOrder(order, "pay_on_delivery");
        } else {
            // ABA / ACLEDA: show that bank's QR + total first
            setPendingOrder(order);
            setStep("qr");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const method = PAYMENT_METHODS.find(
        (m) => m.id === (placedOrder?.payment || pendingOrder?.payment || payment)
    );

    // ---------- STEP 3: Thank you ----------
    if (step === "thanks" && placedOrder) {
        const isCod = placedOrder.payment === "cod";

        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full text-center">
                    <CheckCircle2 size={72} className="mx-auto text-green-600" strokeWidth={1.5} />
                    <h1 className="text-3xl font-bold mt-4">Thank you for your order!</h1>
                    <p className="text-gray-600 mt-2">
                        {placedOrder.customer.name}, your order number is{" "}
                        <span className="font-semibold text-gray-900">{placedOrder.id}</span>.
                    </p>

                    <div className="mt-6 rounded-2xl border border-gray-200 p-5 text-sm text-left">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Payment</span>
                            <span className="font-semibold">{method?.label}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Total</span>
                            <span className="font-bold">{formatPrice(placedOrder.total)}</span>
                        </div>
                        <p className="text-gray-500 border-t pt-3 mt-3">
                            {isCod
                                ? "Please prepare cash. You pay when your order arrives."
                                : "We will confirm your payment and contact you soon."}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/")}
                        className="mt-8 w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    // ---------- STEP 2: QR payment ----------
    if (step === "qr" && pendingOrder) {
        const qrMethod = PAYMENT_METHODS.find((m) => m.id === pendingOrder.payment);
        const bankName = qrMethod?.id === "aba" ? "ABA" : "ACLEDA";

        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-10">
                <div className="max-w-md w-full text-center">
                    <button
                        onClick={() => setStep("form")}
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6"
                    >
                        <ArrowLeft size={16} />
                        Back to details
                    </button>

                    <h1 className="text-2xl font-bold">Scan to pay with {bankName}</h1>
                    <p className="text-sm text-gray-500 mt-1">Order {pendingOrder.id}</p>

                    <div className="mt-6">
                        <QrImage
                            key={qrMethod?.id}
                            src={qrMethod?.qr}
                            alt={`${qrMethod?.label} QR code`}
                        />
                    </div>

                    <div className="mt-6 rounded-2xl border border-gray-200 p-5 text-sm">
                        <div className="flex justify-between text-gray-600 mb-2">
                            <span>Subtotal</span>
                            <span>{formatPrice(pendingOrder.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 mb-3">
                            <span>Delivery</span>
                            <span>{formatPrice(pendingOrder.delivery)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-3">
                            <span>Total Payment</span>
                            <span>{formatPrice(pendingOrder.total)}</span>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                        Open your {bankName} app, scan the QR code and pay exactly{" "}
                        {formatPrice(pendingOrder.total)}. Press the button below after the payment is done.
                    </p>

                    <button
                        onClick={() => finalizeOrder(pendingOrder, "paid_waiting_confirmation")}
                        className="mt-6 w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition"
                    >
                        Order Now
                    </button>
                </div>
            </div>
        );
    }

    // ---------- Empty cart ----------
    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
                <p className="font-semibold text-gray-800">Your bag is empty</p>
                <Link to="/" className="bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    // ---------- STEP 1: Form + payment method ----------
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black">
                <ArrowLeft size={16} />
                Back to shop
            </Link>

            <h1 className="text-2xl sm:text-3xl font-bold mt-4 mb-8">Check Out</h1>

            <form onSubmit={handleSubmit} noValidate className="grid lg:grid-cols-[1fr_380px] gap-10">
                {/* LEFT: details + payment */}
                <div className="flex flex-col gap-10">
                    <section>
                        <h2 className="text-lg font-bold mb-4">Delivery details</h2>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Full name" error={errors.name}>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                    placeholder="Enter Your Name"
                                    className={inputClass(errors.name)}
                                />
                            </Field>

                            <Field label="Phone number" error={errors.phone}>
                                <input
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    autoComplete="tel"
                                    placeholder="Enter Your Phone Number"
                                    className={inputClass(errors.phone)}
                                />
                            </Field>
                        </div>

                        <div className="mt-4">
                            <Field label="Email" error={errors.email}>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className={inputClass(errors.email)}
                                />
                            </Field>
                        </div>

                        <div className="mt-4">
                            <Field label="Location" error={errors.location}>
                                <textarea
                                    name="location"
                                    rows={3}
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="House number, street, sangkat, khan, city"
                                    className={inputClass(errors.location)}
                                />
                            </Field>
                        </div>

                        <div className="mt-4">
                            <Field label="Google Maps link" error={errors.mapLink}>
                                <input
                                    name="mapLink"
                                    type="url"
                                    value={form.mapLink}
                                    onChange={handleChange}
                                    placeholder="https://maps.app.goo.gl/..."
                                    className={inputClass(errors.mapLink)}
                                />
                            </Field>
                            <p className="text-xs text-gray-500 mt-1">
                                Open Google Maps, tap Share, then Copy link and paste it here.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-4">Payment method</h2>

                        <div className="flex flex-col gap-3" role="radiogroup" aria-label="Payment method">
                            {PAYMENT_METHODS.map(({ id, label, note, icon: Icon }) => {
                                const selected = payment === id;

                                return (
                                    <label
                                        key={id}
                                        className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition ${selected
                                                ? "border-black bg-gray-50"
                                                : "border-gray-300 hover:border-gray-400"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={id}
                                            checked={selected}
                                            onChange={() => setPayment(id)}
                                            className="mt-1 accent-black"
                                        />
                                        <Icon size={22} className="mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-sm">{label}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{note}</p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* RIGHT: order summary */}
                <aside className="lg:sticky lg:top-6 self-start rounded-2xl border border-gray-200 p-5">
                    <h2 className="text-lg font-bold mb-4">Order summary</h2>

                    <ul className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-1">
                        {items.map((item) => (
                            <li key={itemKey(item)} className="flex gap-3">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-20 object-cover rounded-lg bg-gray-100 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold line-clamp-2">{item.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {item.color || "-"} / {item.size || "-"} × {item.quantity}
                                    </p>
                                </div>
                                <span className="text-sm font-bold">
                                    {formatPrice(item.price * item.quantity)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div className="border-t mt-5 pt-4 text-sm text-gray-600">
                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between mb-3">
                            <span>Delivery</span>
                            <span>{formatPrice(delivery)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-black border-t pt-3">
                            <span>Total Payment</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-5 w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition"
                    >
                        Check Now
                    </button>
                </aside>
            </form>
        </div>
    );
};

export default Checkout;