import React, { useState } from "react";
import { useAllRatingUser } from "../../hooks/useStore";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const Store = () => {
    const [page, setPage] = useState(1);

    const { data: allRatings, isLoading: ratingsLoading } = useAllRatingUser(page);

    return (
        <div className="p-4 max-w-4xl mx-auto space-y-4">
            <Link to="/" className="inline-block text-gray-600 hover:text-black transition">
                <Home className="w-6 h-6" />
            </Link>

            <section className=" rounded-lg shadow-sm">
                <h2 className="text-lg md:text-xl font-semibold mb-4">User Ratings</h2>

                {ratingsLoading ? (
                    <p className="text-gray-500 text-sm">Loading ratings...</p>
                ) : allRatings?.ratings?.length > 0 ? (
                    <ul className="grid gap-3">
                        {allRatings.ratings.map((rating) => (
                            <li
                                key={rating.id}
                                className="border p-3 rounded-lg flex flex-col gap-1 shadow-sm"
                            >
                                <p className="font-semibold">{rating.user.name}</p>
                                <p className="text-gray-600 text-sm">{rating.user.email}</p>
                                <p className="text-gray-600 text-sm">{rating.user.address}</p>
                                <p className="text-yellow-500 text-sm">⭐ {rating.value} / 5</p>
                                <p className="text-gray-400 text-xs">
                                    Rated on: {new Date(rating.createdAt).toLocaleDateString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-sm">No ratings yet.</p>
                )}

                {allRatings?.pagination?.pages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((old) => Math.max(old - 1, 1))}
                            className="px-3 py-1 bg-gray-200 rounded-md text-sm disabled:opacity-50 hover:bg-gray-300"
                        >
                            Prev
                        </button>

                        {[...Array(allRatings.pagination.pages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`px-3 py-1 rounded-md text-sm transition ${page === i + 1
                                        ? "bg-black text-white"
                                        : "bg-gray-200 hover:bg-gray-300"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            disabled={page === allRatings.pagination.pages}
                            onClick={() =>
                                setPage((old) => Math.min(old + 1, allRatings.pagination.pages))
                            }
                            className="px-3 py-1 bg-gray-200 rounded-md text-sm disabled:opacity-50 hover:bg-gray-300"
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>
        </div>

    );
};

export default Store;
