import { useState } from "react";
const slides = [
    {
        id: 1,
        title: "Celebrate Bon Om Touk in Style",
        description:
            "Discover your perfect festive look with our latest clothing collection. Celebrate Cambodia's Water Festival with confidence, comfort, and style.",
        image:
            "https://i.pinimg.com/1200x/b9/63/c9/b963c9455ad9cf9005b0253e0fc4df3f.jpg",
        button: "Shop Collection",
    },
    {
        id: 2,
        title: "Your Festival, Your Style",
        description:
            "Make every moment unforgettable with trendy streetwear, oversized tees, and fresh everyday essentials made for your celebration.",
        image:
            "https://i.pinimg.com/736x/e7/93/40/e79340da22e6caea1f0b611b110fec0a.jpg",
        button: "Explore Style",
    },
    {
        id: 3,
        title: "Water Festival Special Deals",
        description:
            "Celebrate Cambodia's biggest water festival with fresh new arrivals and special offers. Find your favorite looks and enjoy the festivities in style.",
        image:
            "https://i.pinimg.com/736x/61/08/3e/61083ef03f8649006159c847e2117270.jpg",
        button: "Discover Deals",
    },
];

function Hero() {
    const [count, setCount] = useState(0);

    // Next slide
    const nextsider = () => {
        setCount((prev) => (prev + 1) % slides.length);
    };

    // Previous slide
    const sider = () => {
        setCount(
            (prev) => (prev - 1 + slides.length) % slides.length
        );
    };

    const slide = slides[count];

    return (
        <section className="w-full">
            <div className="relative h-[420px] overflow-hidden bg-gray-900 sm:h-[500px]">

                {/* Background image */}
                <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/45" />

                {/* Text content */}
                <div className="relative z-10 flex h-full max-w-2xl flex-col justify-center px-8 text-white sm:px-16">
                    <p className="mb-3 text-sm font-semibold tracking-[0.3em]">
                        BON OM TOUK SPECIAL
                    </p>

                    <h1 className="text-4xl font-bold sm:text-6xl">
                        {slide.title}
                    </h1>

                    <p className="mt-5 max-w-md text-sm text-gray-200 sm:text-base">
                        {slide.description}
                    </p>

                    <button
                        onClick={() => {
                            document
                                .getElementById("products")
                                ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="mt-7 w-fit rounded-full bg-white px-7 py-3 font-semibold text-black transition"
                    >
                        {slide.button}
                    </button>
                </div>

                {/* Previous button */}
                <button
                    onClick={sider}
                    aria-label="Previous slide"
                    className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-3 text-black hover:bg-white"
                >
                    &#10094;
                </button>

                {/* Next button */}
                <button
                    onClick={nextsider}
                    aria-label="Next slide"
                    className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-3 text-black hover:bg-white"
                >
                    &#10095;
                </button>

                {/* Dots */}
                <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                    {slides.map((item, index) => (
                        <button
                            key={item.id}
                            onClick={() => setCount(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={count === index ? "true" : undefined}
                            className={`h-2.5 rounded-full transition-all ${count === index
                                ? "w-8 bg-white"
                                : "w-2.5 bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Hero;
