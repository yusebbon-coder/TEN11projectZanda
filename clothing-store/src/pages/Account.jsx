import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const readCurrentUser = () => {
    try {
        return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
        return null;
    }
};

const Account = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(readCurrentUser());
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        window.dispatchEvent(new Event("authUpdated"));
        navigate("/");
    };

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
                <p className="font-semibold text-gray-800">Please login to see your account.</p>
                <Link to="/" className="bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold">
                    Back to shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 p-6 sm:p-8">
                <h1 className="text-2xl font-bold">My Account</h1>

                <div className="mt-6 text-sm">
                    <div className="flex justify-between py-3 border-b">
                        <span className="text-gray-500">Full name</span>
                        <span className="font-semibold">{user.fullName}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                        <span className="text-gray-500">Email</span>
                        <span className="font-semibold">{user.email}</span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="mt-6 w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Account;