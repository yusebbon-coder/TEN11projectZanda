import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginModal({ isOpen, onClose }) {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // បើមិនបើក មិនបង្ហាញអ្វីទាំងអស់
    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(
            (u) => u.email === form.email && u.password === form.password
        );

        if (!user) {
            setError("អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ");
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(user));
        setForm({ email: "", password: "" });
        onClose();
        navigate("/account");
    };

    return (
        // Overlay: ចុចខាងក្រៅដើម្បីបិទ
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            {/* Box: stopPropagation កុំឲ្យចុចខាងក្នុងបិទ Modal */}
            <div
                className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ប៊ូតុងបិទ */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-700"
                >
                    &times;
                </button>

                <h2 className="mb-6 text-center text-2xl font-bold">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    មិនទាន់មានគណនី?{" "}
                    <Link
                        to="/register"
                        onClick={onClose}
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}