import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { products } from "../Javascript/products";
import { useSearch } from "../context/SearchContext";
const SearchSection = () => {
    const { search, setSearch } = useSearch();
    const sectionRef = useRef(null);

    // Search: input -> filter data
    const query = search.trim().toLowerCase();
    const results = query
        ? products.filter(
            (p) =>
                p.name.toLowerCase().includes(query) ||
                p.category?.toLowerCase().includes(query)
        )
        : [];

    // scroll to this section when user is searching
    useEffect(() => {
        if (query && sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [query]);

    // input empty -> show nothing
    if (!query) return null;

    return (
        <section ref={sectionRef} className="max-w-7xl mx-auto px-4 py-10 scroll-mt-24">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                    Search results for "{search}"
                </h2>
                <button
                    onClick={() => setSearch("")}
                    className="text-sm px-4 py-2 border rounded-full hover:bg-gray-100"
                >
                    Clear
                </button>
            </div>

            {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {results.map((item) => (
                        <Link
                            key={item.id}
                            to={`/product/${item.id}`} // change to your Detail page route
                            className="group border rounded-xl overflow-hidden bg-white hover:shadow-lg transition"
                        >
                            <div className="aspect-square overflow-hidden bg-gray-100">
                                <img
                                    src={item.image}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                            </div>
                            <div className="p-3">
                                <p className="font-medium truncate">{item.name}</p>
                                <p className="text-gray-500">${item.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-16 text-lg">
                    No Product "<span className="font-semibold text-black">{search}</span>"
                </p>
            )}
        </section>
    );
};

export default SearchSection;