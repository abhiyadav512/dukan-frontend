import React, { useState } from "react";
import { useAllRatingUser } from "../../hooks/useStore";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const Store = () => {
    const [page, setPage] = useState(1);

    const { data: allRatings, isLoading: ratingsLoading } = useAllRatingUser(page);

   

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <Link to={"/"}><Home /></Link>
            <section className=" p-4 rounded">
                <h2 className="text-xl font-semibold mb-3">User Ratings</h2>
                {ratingsLoading ? (
                    <p>Loading ratings...</p>
                ) : allRatings?.ratings?.length > 0 ? (
                    <ul className="grid gap-3">
                        {allRatings.ratings.map((rating) => (
                            <li key={rating.id} className="border p-3 rounded flex flex-col gap-1">
                                <p className="font-semibold">{rating.user.name}</p>
                                <p className="text-gray-600">{rating.user.email}</p>
                                <p className="text-gray-600">{rating.user.address}</p>
                                <p className="text-yellow-500">⭐ {rating.value} / 5</p>
                                <p className="text-gray-400 text-sm">
                                    Rated on: {new Date(rating.createdAt).toLocaleDateString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No ratings yet.</p>
                )}

                <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((old) => Math.max(old - 1, 1))}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>

                    {[...Array(allRatings?.pagination?.pages || 1)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded ${page === i + 1
                                ? "bg-black text-white"
                                : "bg-gray-200"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={page === allRatings?.pagination?.pages}
                        onClick={() =>
                            setPage((old) =>
                                Math.min(old + 1, allRatings?.pagination?.pages)
                            )
                        }
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Store;
