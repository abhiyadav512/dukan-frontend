import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllStore, useMakeRating } from "../../hooks/useUser";
import { getStoredUser, useLogout } from "../../hooks/useAuth";
import { useStoreInfo } from "../../hooks/useStore";
import { HomeIcon } from "lucide-react";
import { toast } from "react-hot-toast";

const Home = () => {
    const isAuth = Boolean(localStorage.getItem("token"));
    const logout = useLogout();
    const user = getStoredUser();

    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filterBy, setFilterBy] = useState("name");
    const [page, setPage] = useState(1);

    const { mutate: rateStore } = useMakeRating();

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchValue);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchValue]);

    const {
        data: allStore,
        isLoading: storesLoading,
        isError: storesError,
        error: storesErrorMsg,
    } = useGetAllStore(debouncedSearch, filterBy, page);

    const {
        data: storeInfo,
        isLoading: infoLoading,
        isError: infoError,
        error: infoErrorMsg,
    } = useStoreInfo();

    const handleRating = (storeId, rating) => {
        rateStore(
            { storeId, rating },
            {
                onSuccess: () => toast.success("Rating submitted"),
                onError: () => toast.error("Failed to submit rating"),
            }
        );
    };

    const stores = allStore?.stores || [];
    const totalPages = allStore?.pagination?.pages || 1;

    return (
        <main className="p-4 max-w-4xl mx-auto space-y-6">
            <header className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <HomeIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                    <h1 className="text-lg md:text-xl font-bold">Dukan</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                    {isAuth ? (
                        <button
                            onClick={logout}
                            className="px-3 py-1.5 bg-black text-white rounded-md text-sm md:text-base hover:bg-gray-800 transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="px-3 py-1.5 bg-black text-white rounded-md text-sm md:text-base hover:bg-gray-800 transition"
                        >
                            Login
                        </Link>
                    )}
                    {user?.role === "ADMIN" && (
                        <Link
                            to="/admin"
                            className="px-3 py-1.5 bg-black text-white rounded-md text-sm md:text-base hover:bg-gray-800 transition"
                        >
                            Admin
                        </Link>
                    )}
                    {user?.role === "USER" && (
                        <Link
                            to="/my-ratings"
                            className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm md:text-base hover:bg-blue-600 transition"
                        >
                            My Ratings
                        </Link>
                    )}
                    {user?.role === "STORE_OWNER" && (
                        <Link
                            to="/my-store"
                            className="px-3 py-1.5 bg-black text-white rounded-md text-sm md:text-base hover:bg-gray-800 transition"
                        >
                            See All User
                        </Link>
                    )}
                </div>
            </header>

            {user?.role === "USER" && (
                <section>
                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={`Search by ${filterBy}`}
                            className="border px-3 py-2 rounded w-full text-sm md:text-base"
                        />
                        <select
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                            className="border px-3 py-2 rounded text-sm md:text-base"
                        >
                            <option value="name">Name</option>
                            <option value="address">Address</option>
                        </select>
                    </div>

                    {storesLoading && (
                        <p className="text-center text-gray-500 text-sm">Loading stores...</p>
                    )}
                    {storesError && (
                        <p className="text-center text-red-500 text-sm">
                            {storesErrorMsg?.message || "Error fetching stores"}
                        </p>
                    )}

                    {!storesLoading && !storesError && stores.length === 0 && (
                        <p className="text-center text-gray-500 text-sm">No stores found.</p>
                    )}

                    {!storesLoading && !storesError && stores.length > 0 && (
                        <>
                            <ul className="grid gap-3">
                                {stores.map((store) => (
                                    <li key={store.id} className="border p-3 rounded-lg shadow-sm">
                                        <h2 className="font-semibold text-base md:text-lg">
                                            {store.name}
                                        </h2>
                                        <p className="text-gray-600 text-sm">{store.address}</p>
                                        <p className="text-yellow-600 text-sm">
                                            ⭐ Average: {store.averageRating ?? "No rating"}
                                        </p>
                                        <div className="flex gap-1 mt-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => handleRating(store.id, star)}
                                                    className={`text-lg md:text-xl transition hover:scale-110 ${star <= (store.userRating || 0)
                                                            ? "text-yellow-500"
                                                            : "text-gray-400"
                                                        }`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-6">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage((old) => Math.max(old - 1, 1))}
                                        className="px-3 py-1 bg-gray-200 rounded-md text-sm disabled:opacity-50"
                                    >
                                        Prev
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            className={`px-3 py-1 rounded-md text-sm ${page === i + 1
                                                    ? "bg-black text-white"
                                                    : "bg-gray-200 hover:bg-gray-300"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
                                        className="px-3 py-1 bg-gray-200 rounded-md text-sm disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            )}

            {user?.role === "STORE_OWNER" && (
                <section className="border p-4 rounded-lg shadow-sm">
                    <h2 className="font-semibold text-lg mb-2">My Store</h2>
                    {infoLoading && (
                        <p className="text-center text-gray-500 text-sm">
                            Loading store info...
                        </p>
                    )}
                    {infoError && (
                        <p className="text-center text-red-500 text-sm">
                            Contact Admin to create Store.
                            {infoErrorMsg?.message || "Error fetching store info"}
                        </p>
                    )}
                    {!infoLoading && !infoError && storeInfo?.store && (
                        <>
                            <h1 className="text-xl font-bold mb-2">{storeInfo.store.name}</h1>
                            <p className="text-gray-600 text-sm">{storeInfo.store.address}</p>
                            <p className="text-gray-600 text-sm">Email: {storeInfo.store.email}</p>
                            <p className="text-yellow-600 text-sm">
                                ⭐ Average Rating: {storeInfo.store.averageRating ?? "No rating"}
                            </p>
                            <p className="text-gray-500 text-sm">
                                Total Ratings: {storeInfo.store.totalRatings}
                            </p>
                        </>
                    )}
                </section>
            )}

            <p className="mt-6 text-center text-gray-700 text-sm md:text-base">
                Welcome to Dukan
            </p>
        </main>

    );
};

export default Home;
