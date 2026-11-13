import { Link } from "react-router-dom";

const shopLinks = [
    { label: "Men", to: "/men" },
    { label: "Women", to: "/women" },
    { label: "Accessories", to: "/accessory" },
];

const helpLinks = [
    { label: "Shipping & delivery", to: "/shipping" },
    { label: "Returns & exchanges", to: "/returns" },
    { label: "Size guide", to: "/size-guide" },
    { label: "Contact us", to: "/contact" },
];

const socials = [
    {
        name: "Facebook",
        href: "https://facebook.com",
        path: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z",
    },
    {
        name: "Instagram",
        href: "https://instagram.com",
        path: "M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
    },
    {
        name: "TikTok",
        href: "https://tiktok.com",
        path: "M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1 0-5.2c.27 0 .53.04.77.12V9.66a5.7 5.7 0 0 0-.77-.05 5.69 5.69 0 1 0 5.69 5.69V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z",
    },
    {
        name: "Telegram",
        href: "https://t.me",
        path: "M21.94 4.36 18.6 20.1c-.25 1.11-.9 1.38-1.83.86l-5.05-3.72-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.15 9.37-8.47c.41-.36-.09-.56-.63-.2L5.8 13.57l-4.99-1.56c-1.08-.34-1.1-1.08.23-1.6L20.55 2.9c.9-.33 1.69.2 1.39 1.46Z",
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-stone-200 bg-white text-stone-700 mt-5">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
                <div className="col-span-2 lg:col-span-1">
                    <Link to="/" className="text-3xl font-bold tracking-widest text-black">
                        ZANDA
                    </Link>
                    <p className="mt-4 max-w-xs text-sm leading-6 text-stone-500">
                        Everyday clothing for men and women, made to be worn often and
                        kept for years.
                    </p>
                    <div className="mt-6 flex gap-3">
                        {socials.map((s) => (
                            <a
                                key={s.name}
                                href={s.href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={s.name}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-stone-600 transition hover:border-black hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black/40"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                    <path d={s.path} />
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>

                <nav aria-label="Shop">
                    <h3 className="text-base font-semibold text-black">Shop</h3>
                    <ul className="mt-4 space-y-3 text-sm">
                        {shopLinks.map((l) => (
                            <li key={l.label}>
                                <Link to={l.to} className="transition hover:text-black hover:underline">
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <nav aria-label="Customer care">
                    <h3 className="text-base font-semibold text-black">Customer care</h3>
                    <ul className="mt-4 space-y-3 text-sm">
                        {helpLinks.map((l) => (
                            <li key={l.label}>
                                <Link to={l.to} className="transition hover:text-black hover:underline">
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="col-span-2 lg:col-span-1">
                    <h3 className="text-base font-semibold text-black">Visit or call</h3>
                    <address className="mt-4 space-y-3 text-sm not-italic leading-6">
                        <p>Phnom Penh, Cambodia</p>
                        <p>
                            <a href="tel:+85500000000" className="transition hover:text-black hover:underline">
                                +855 00 000 000
                            </a>
                        </p>
                        <p>
                            <a href="mailto:hello@zanda.com" className="transition hover:text-black hover:underline">
                                hello@zanda.com
                            </a>
                        </p>
                        <p className="text-stone-500">Open daily, 9:00 am – 8:00 pm</p>
                    </address>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-stone-200">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-stone-500 sm:flex-row sm:px-6 lg:px-8">
                    <p>© {new Date().getFullYear()} ZANDA. All rights reserved.</p>
                    <p>Pay on delivery · ABA · ACLEDA</p>
                    <div className="flex gap-5">
                        <Link to="/privacy" className="transition hover:text-black hover:underline">
                            Privacy policy
                        </Link>
                        <Link to="/terms" className="transition hover:text-black hover:underline">
                            Terms of service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}