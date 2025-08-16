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
        <main className="p-4 max-w-4xl mx-auto">
            <header className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                    <HomeIcon className="mt-2" />
                    <h1 className="text-2xl font-bold">Dukan</h1>
                </div>
                <div className="flex gap-2">
                    {isAuth ? (
                        <button onClick={logout} className="px-3 py-1 bg-black text-white rounded">
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="px-3 py-1 bg-black text-white rounded">
                            Login
                        </Link>
                    )}
                    {user?.role === "ADMIN" && (
                        <Link to="/admin" className="px-3 py-1 bg-black text-white rounded">
                            Admin
                        </Link>
                    )}
                    {user?.role === "USER" && (
                        <Link to="/my-ratings" className="px-3 py-1 bg-blue-500 text-white rounded">
                            My Ratings
                        </Link>
                    )}
                    {user?.role === "STORE_OWNER" && (
                        <Link to="/my-store" className="px-3 py-1 bg-black text-white rounded">
                            See All User
                        </Link>
                    )}
                </div>
            </header>

            {user?.role === "USER" && (
                <section>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={`Search by ${filterBy}`}
                            className="border px-3 py-2 rounded w-full"
                        />
                        <select
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                            className="border px-3 py-2 rounded"
                        >
                            <option value="name">Name</option>
                            <option value="address">Address</option>
                        </select>
                    </div>

                    {storesLoading && <p className="text-center text-gray-500">Loading stores...</p>}
                    {storesError && (
                        <p className="text-center text-red-500">
                            {storesErrorMsg?.message || "Error fetching stores"}
                        </p>
                    )}

                    {!storesLoading && !storesError && stores.length === 0 && (
                        <p className="text-center text-gray-500">No stores found.</p>
                    )}

                    {!storesLoading && !storesError && stores.length > 0 && (
                        <>
                            <ul className="grid gap-3">
                                {stores.map((store) => (
                                    <li key={store.id} className="border p-3 rounded">
                                        <h2 className="font-semibold">{store.name}</h2>
                                        <p className="text-gray-600">{store.address}</p>
                                        <p className="text-yellow-600">
                                            ⭐ Average: {store.averageRating ?? "No rating"}
                                        </p>
                                        <div className="flex gap-1 mt-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => handleRating(store.id, star)}
                                                    className={`text-xl transition hover:scale-110 ${star <= (store.userRating || 0) ? "text-yellow-500" : "text-gray-400"
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
                                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                    >
                                        Prev
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            className={`px-3 py-1 rounded ${page === i + 1 ? "bg-black text-white" : "bg-gray-200"}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
                                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
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
                <section className="border p-4 rounded">
                    My Store
                    {infoLoading && <p className="text-center text-gray-500">Loading store info...</p>}
                    {infoError && (
                        <p className="text-center text-red-500">
                            Contact Admin to create Store.
                            {infoErrorMsg?.message || "Error fetching store info"}
                        </p>
                    )}
                    {!infoLoading && !infoError && storeInfo?.store && (
                        <>
                            <h1 className="text-2xl font-bold mb-2">{storeInfo.store.name}</h1>
                            <p className="text-gray-600 mb-1">{storeInfo.store.address}</p>
                            <p className="text-gray-600 mb-1">Email: {storeInfo.store.email}</p>
                            <p className="text-yellow-600 mb-1">
                                ⭐ Average Rating: {storeInfo.store.averageRating ?? "No rating"}
                            </p>
                            <p className="text-gray-500">Total Ratings: {storeInfo.store.totalRatings}</p>
                        </>
                    )}
                </section>
            )}

            <p className="mt-6 text-center text-gray-700">Welcome to Dukan</p>
        </main>
    );
};

export default Home;
