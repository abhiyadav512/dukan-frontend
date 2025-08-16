import React from "react";
import { useGetAllRatings } from "../../hooks/useUser";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const MyRatings = () => {
    const { data, isLoading, isError } = useGetAllRatings();

    if (isLoading) return <p>Loading your ratings...</p>;
    if (isError) return <p>Error loading ratings.</p>;

    return (
        <div className="p-4 max-w-4xl mx-auto">
        <div className="flex gap-4">
                <Link to={"/"}>
                    <Home  className="mt-2"/>
                </Link>
                <h1 className="text-2xl font-bold mb-4">My Ratings</h1>
        </div>

            {data?.ratings?.length > 0 ? (
                <ul className="grid gap-3">
                    {data.ratings.map((rating) => (
                        <li
                            key={rating.id}
                            className="border p-3 rounded flex flex-col gap-1"
                        >
                            <h2 className="font-semibold">{rating.store.name}</h2>
                            <p className="text-gray-600">{rating.store.address}</p>
                            <p className="text-yellow-500">
                                ⭐ {rating.value} / 5
                            </p>
                            <p className="text-gray-400 text-sm">
                                Rated on: {new Date(rating.updatedAt).toLocaleDateString()}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">You haven’t rated any stores yet.</p>
            )}
        </div>
    );
};

export default MyRatings;
