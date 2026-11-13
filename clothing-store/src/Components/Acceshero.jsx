import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

// Replace the image URLs with your own files (e.g. "/images/men-1.jpg")
const slides = [
    {
        id: 1,
        image:
            "https://i.pinimg.com/736x/ad/51/27/ad5127782fda0ccc70fb9d51531cedd0.jpg",
        title: "Elevate Your Everyday Style",
        text: "Discover modern men's fashion designed for confidence and comfort. Explore premium essentials, trendy outfits, and timeless styles for every occasion.",
        link: "/men",
    },
    {
        id: 2,
        image:
            "https://i.pinimg.com/736x/d9/f6/7b/d9f67b4a35399e8754aa0b8183a1c920.jpg",
        title: "Fresh Styles, New Looks",
        text: "Explore our latest arrivals and upgrade your wardrobe with fresh designs, modern trends, and must-have fashion pieces.",
        link: "/men",
    },
    {
        id: 3,
        image:
            "https://i.pinimg.com/1200x/73/e3/91/73e391e359fe9b40af59c968de02d574.jpg",
        title: "Loved by Everyone",
        text: "Shop our most popular styles, carefully selected for their quality, comfort, and timeless appeal.",
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