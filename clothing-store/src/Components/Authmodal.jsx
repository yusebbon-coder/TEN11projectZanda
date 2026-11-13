
import React, { useEffect, useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";

// ---------- LocalStorage Helpers ----------

const readUsers = () => {
    try {
        const data = JSON.parse(localStorage.getItem("users") || "[]");
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

// ---------- Validation ----------

const isValidEmail = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const isValidPassword = (v) =>
    /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v);

const emptyForm = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

// ---------- Input Style ----------

const inputClass = (error) =>
    `w-full rounded-lg border px-4 py-3 text-sm outline-none
   transition focus:border-black focus:ring-1 focus:ring-black
   ${error ? "border-red-400" : "border-gray-300"
    }`;

// ---------- Field Component ----------

const Field = ({ label, error, children }) => (
    <label className="block">
        <span className="text-sm font-semibold text-gray-800">
            {label}
        </span>

        <div className="mt-1">
            {children}
        </div>

        {error && (
            <p className="text-xs text-red-500 mt-1">
                {error}
            </p>
        )}
    </label>
);

// ---------- Password Input Component ----------

const PasswordInput = ({ error, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative w-full">

            <input
                {...props}
                type={showPassword ? "text" : "password"}
                className={`${inputClass(error)} pr-12`}
            />

            {/* Show / Hide Password Icon */}
            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                    showPassword ? "Hide password" : "Show password"
                }
                className="absolute right-3 top-1/2
          -translate-y-1/2 text-gray-500
          hover:text-black transition"
            >
                {showPassword ? (
                    <EyeOff size={20} />
                ) : (
                    <Eye size={20} />
                )}
            </button>

        </div>
    );
};

// ---------- Auth Modal ----------

const AuthModal = ({ open, mode, setMode, onClose }) => {

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);

    // Reset Form
    useEffect(() => {
        setForm(emptyForm);
        setErrors({});
        setMessage(null);
    }, [open, mode]);

    // Close with Escape
    useEffect(() => {
        if (!open) return;

        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
        };

        document.body.style.overflow = "hidden";

        window.addEventListener("keydown", handleKey);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKey);
        };
    }, [open, onClose]);

    if (!open) return null;

    // ---------- Handle Change ----------

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }

        if (message) setMessage(null);
    };

    // ---------- Register ----------

    const handleRegister = (e) => {
        e.preventDefault();

        const found = {};
        const email = form.email.trim().toLowerCase();

        if (!form.fullName.trim()) {
            found.fullName = "Enter your full name.";
        }

        if (!isValidEmail(email)) {
            found.email = "Enter a valid email address.";
        } else if (
            readUsers().some((u) => u.email === email)
        ) {
            found.email = "This email is already registered.";
        }

        if (!isValidPassword(form.password)) {
            found.password =
                "Password must be at least 8 characters with letters and numbers.";
        }

        if (form.confirmPassword !== form.password) {
            found.confirmPassword =
                "Confirm password does not match.";
        }

        setErrors(found);

        if (Object.keys(found).length > 0) return;

        const newUser = {
            id: Date.now(),
            fullName: form.fullName.trim(),
            email,
            password: form.password,
            createdAt: new Date().toISOString(),
        };

        writeStorage("users", [...readUsers(), newUser]);

        setMessage({
            type: "success",
            text: "Register successfully! Please login.",
        });

        setTimeout(() => {
            setMode("login");
        }, 1200);
    };

    // ---------- Login ----------

    const handleLogin = (e) => {
        e.preventDefault();

        const email = form.email.trim().toLowerCase();
        const found = {};

        if (!email) {
            found.email = "Enter your email.";
        }

        if (!form.password) {
            found.password = "Enter your password.";
        }

        setErrors(found);

        if (Object.keys(found).length > 0) return;

        const user = readUsers().find(
            (u) =>
                u.email === email &&
                u.password === form.password
        );

        if (!user) {
            setMessage({
                type: "error",
                text: "Login failed. Email or password is incorrect.",
            });

            return;
        }

        // Save current user without password
        writeStorage("currentUser", {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
        });

        // Notify Navbar
        window.dispatchEvent(new Event("authUpdated"));

        setMessage({
            type: "success",
            text: "Login Success!",
        });

        setTimeout(() => {
            onClose();
        }, 900);
    };

    const isLogin = mode === "login";

    // ---------- UI ----------

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">

            {/* Background */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <div
                role="dialog"
                aria-modal="true"
                className="relative w-full max-w-md bg-white
          rounded-2xl shadow-2xl p-6 sm:p-8
          max-h-[90vh] overflow-y-auto"
            >

                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 p-2
            hover:bg-gray-100 rounded-full transition"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <h2 className="text-2xl font-bold text-gray-900">
                    {isLogin ? "Login" : "Register"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    {isLogin
                        ? "Welcome back to ZANDA."
                        : "Create your ZANDA account."}
                </p>

                {/* Form */}
                <form
                    onSubmit={isLogin ? handleLogin : handleRegister}
                    noValidate
                    className="mt-6 flex flex-col gap-4"
                >

                    {/* Full Name */}
                    {!isLogin && (
                        <Field
                            label="Full Name"
                            error={errors.fullName}
                        >
                            <input
                                name="fullName"
                                type="text"
                                value={form.fullName}
                                onChange={handleChange}
                                autoComplete="name"
                                placeholder="Enter your full name"
                                className={inputClass(errors.fullName)}
                            />
                        </Field>
                    )}

                    {/* Email */}
                    <Field
                        label="Email"
                        error={errors.email}
                    >
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

                    {/* Password */}
                    <Field
                        label="Password"
                        error={errors.password}
                    >
                        <PasswordInput
                            key={`${mode}-password`}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete={
                                isLogin
                                    ? "current-password"
                                    : "new-password"
                            }
                            placeholder="Enter your password"
                            error={errors.password}
                        />
                    </Field>

                    {/* Confirm Password */}
                    {!isLogin && (
                        <Field
                            label="Confirm Password"
                            error={errors.confirmPassword}
                        >
                            <PasswordInput
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                placeholder="Confirm your password"
                                error={errors.confirmPassword}
                            />
                        </Field>
                    )}

                    {/* Message */}
                    {message && (
                        <p
                            role="alert"
                            className={`text-sm rounded-lg px-4 py-3 ${message.type === "success"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-600"
                                }`}
                        >
                            {message.text}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-black text-white
              py-3.5 rounded-xl font-semibold
              hover:bg-gray-800 active:scale-[0.98]
              transition"
                    >
                        {isLogin ? "Login" : "Register"}
                    </button>

                </form>

                {/* Switch Mode */}
                <p className="text-sm text-gray-600 text-center mt-5">
                    {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}

                    {" "}

                    <button
                        type="button"
                        onClick={() =>
                            setMode(isLogin ? "register" : "login")
                        }
                        className="font-semibold text-black underline
              hover:text-gray-500"
                    >
                        {isLogin ? "Register" : "Login"}
                    </button>
                </p>

            </div>
        </div>
    );
};

export default AuthModal;
