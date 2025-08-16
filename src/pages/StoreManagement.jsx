import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { useListOfStores, useCreateStore } from "../../hooks/useAdmin";
import { toast } from "react-hot-toast";

const StoreManagement = () => {
    const [form, setForm] = useState({ name: "", email: "", address: "" });

    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("name");

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchValue);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchValue]);

    const { data: storeList, isLoading, isError, error } = useListOfStores(
        debouncedSearch,
        page,
        sortBy
    );

    const createStoreMutation = useCreateStore();

    const handleCreateStore = () => {
        const { name, email, address } = form;
        if (!name || !email || !address) {
            toast.error("All fields are required");
            return;
        }

        createStoreMutation.mutate(
            { name, email, address },
            {
                onSuccess: (res) => {
                    toast.success(res.message || "Store created successfully");
                    setForm({ name: "", email: "", address: "" }); 
                },
                onError: (err) =>
                    toast.error(err?.response?.data?.error || "Failed to create store"),
            }
        );
    };

    const stores = storeList?.stores || [];
    const totalPages = storeList?.pagination?.pages || 1;

    return (
        <div className="p-6 space-y-6">
            <div className="flex gap-4 items-center mb-4">
                <Link to={"/admin"}>
                    <Home className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold">Store Management</h1>
            </div>

            <div className="bg-white p-4 shadow rounded">
                <h2 className="text-lg font-semibold mb-4">Create Store</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateStore();
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <input
                        type="text"
                        placeholder="Store Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="border p-2 rounded w-full"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Store Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="border p-2 rounded w-full"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Store Address"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="border p-2 rounded w-full md:col-span-2"
                        required
                    />

                    <button
                        type="submit"
                        disabled={createStoreMutation.isLoading}
                        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50 md:col-span-2"
                    >
                        {createStoreMutation.isLoading ? "Creating..." : "Create Store"}
                    </button>
                </form>
            </div>

            <div className="bg-white p-4 shadow rounded">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <h2 className="text-lg font-semibold">Stores</h2>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="border p-2 rounded w-full md:w-64"
                    />
                </div>

                {isLoading && <p>Loading stores...</p>}
                {isError && (
                    <p className="text-red-500">{error?.message || "Error fetching stores"}</p>
                )}
                {!isLoading && !isError && stores.length === 0 && (
                    <p>No stores found.</p>
                )}

                {!isLoading && !isError && stores.length > 0 && (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full border text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 border">Name</th>
                                        <th className="p-2 border">Email</th>
                                        <th className="p-2 border">Address</th>
                                        <th className="p-2 border">Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stores.map((s) => (
                                        <tr key={s.id} className="hover:bg-gray-50">
                                            <td className="p-2 border">{s.name}</td>
                                            <td className="p-2 border">{s.email}</td>
                                            <td className="p-2 border">{s.address}</td>
                                            <td className="p-2 border">{s.averageRating ?? "N/A"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-4">
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
                                        className={`px-3 py-1 rounded ${page === i + 1 ? "bg-black text-white" : "bg-gray-200"
                                            }`}
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
            </div>
        </div>

    );
};

export default StoreManagement;
