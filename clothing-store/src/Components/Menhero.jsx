import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

// Replace the image URLs with your own files (e.g. "/images/men-1.jpg")
const slides = [
    {
        id: 1,
        image:
            "https://i.pinimg.com/736x/48/62/91/4862915ec9017aeee70a7ff0ca5ab172.jpg",
        title: "OWN YOUR STREET.DEFINE YOUR STYLE.",
        text: "Discover the latest men's fashion.Designed for confidence.Made for you.",
        link: "/men",
    },
    {
        id: 2,
        image:
            "https://i.pinimg.com/736x/9a/e6/e0/9ae6e083754ae67af5180c5179ddd7a7.jpg",
        title: "ELEVATE YOUR EVERYDAY STYLE.",
        text: "Discover timeless essentials designed for the modern man. Experience premium quality, effortless elegance, and confidence in every detail.",
        link: "/men",
    },
    {
        id: 3,
        image:
            "https://i.pinimg.com/736x/24/4c/00/244c004bef0cbba5465b25c703d94d4f.jpg",
        title: "EVERYDAY LOOK. EXTRAORDINARY STYLE.",
        text: "Upgrade your everyday wardrobe with comfortable and versatile fashion. Discover effortless outfits made for every moment, every mood, and every occasion.",
        link: "/men",
    },
];

export default function MenHero() {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);

    const next = useCallback(
        () => setCurrent((i) => (i + 1) % slides.length),
        []
    );
    const prev = () =>
        setCurrent((i) => (i - 1 + slides.length) % slides.length);

    // Auto-play every 5 seconds, stops while the mouse is over the slider
    useEffect(() => {
        if (paused) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [paused, next]);

    return (
        <section
            className="relative w-full h-[60vh] min-h-[360px] md:h-[85vh] lg:h-[calc(100vh-80px)] lg:min-h-[640px] overflow-hidden bg-black"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carousel"
            aria-label="Men collection highlights"
        >
            {/* Slides */}
            <div
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {slides.map((s) => (
                    <div key={s.id} className="relative w-full h-full shrink-0">
                        <img
                            src={s.image}
                            alt={s.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

                        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center">
                            <div className="max-w-lg text-white">
                                <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                                    {s.title}
                                </h2>
                                <p className="mt-4 text-base md:text-lg text-white/85">
                                    {s.text}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Prev / Next arrows */}
            <button
                onClick={prev}
                aria-label="Previous slide"
                className="absolute left-3 md:left-6 top-1/2 rounded-full -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>
            <button
                onClick={next}
                aria-label="Next slide"
                className="absolute right-3 rounded-full md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 6l6 6-6 6" />
                </svg>
            </button>

            {/* Dots */}
            <div className="absolute bottom-5  left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => setCurrent(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`h-1.5 transition-all ${i === current ? "w-8 bg-white" : "w-4 bg-white/50 hover:bg-white/80"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}