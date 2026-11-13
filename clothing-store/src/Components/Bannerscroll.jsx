import { useState, useEffect } from "react";

// Step 1: the list of banner images (replace the URLs with your own)
const banners = [
    { id: 1, src: "https://i.pinimg.com/736x/61/1b/8e/611b8e2c228e025f904eb7979c849743.jpg" },
    { id: 2, src: "https://i.pinimg.com/1200x/a9/20/c5/a920c5e5bc8c5abb6ddc500fc9e37fcd.jpg" },
    { id: 3, src: "https://i.pinimg.com/1200x/c6/9c/e0/c69ce09062deeebb82adcf923f562fed.jpg"},
    { id: 4, src: "https://i.pinimg.com/736x/f3/0f/46/f30f4625f9f88d3a278be774fd9aecb5.jpg" },
];

export default function AutoScrollBanner({ images = banners, interval = 3000 }) {
    // Step 2: State = which slide is showing now
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);

    // Step 3: Auto scroll with useEffect + setInterval
    useEffect(() => {
        if (paused) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, interval);
        return () => clearInterval(timer); // cleanup
    }, [paused, interval, images.length]);

    const prev = () =>
        setCurrent((c) => (c - 1 + images.length) % images.length);
    const next = () => setCurrent((c) => (c + 1) % images.length);

    return (
        <div
            className="relative w-full mt-5 max-w-7xl md:max-w-full mx-auto overflow-hidden rounded-xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Step 4: Slider track — move left using translateX */}
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {images.map((img) => (
                    <img
                        key={img.id}
                        src={img.src}
                        alt={img.alt}
                        className="w-full shrink-0 aspace[3/4] sm:h-72 md:h-96 object-cover"
                    />
                ))}
            </div>

            {/* Prev / Next buttons */}
            <button
                onClick={prev}
                aria-label="Previous banner"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 text-white hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
                ‹
            </button>
            <button
                onClick={next}
                aria-label="Next banner"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 text-white hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
                ›
            </button>

            {/* Step 5: Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((img, i) => (
                    <button
                        key={img.id}
                        onClick={() => setCurrent(i)}
                        aria-label={`Go to banner ${i + 1}`}
                        className={`h-2.5 rounded-full transition-all ${i === current ? "w-6 bg-white" : "w-2.5 bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
