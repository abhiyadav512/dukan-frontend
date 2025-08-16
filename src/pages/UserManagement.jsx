import React, { useState, useEffect } from "react";
import { useListOfUsers, useCreateUser } from "../../hooks/useAdmin";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const UserManagement = () => {
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filterBy, setFilterBy] = useState("name");
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

    const { data: userList, isLoading } = useListOfUsers(
        debouncedSearch,
        page,
        sortBy,
        filterBy
    );
    const createUserMutation = useCreateUser();

    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user",
    });

    const handleAddUser = (e) => {
        e.preventDefault();
        createUserMutation.mutate(newUser, {
            onSuccess: () => {
                setNewUser({
                    name: "",
                    email: "",
                    password: "",
                    address: "",
                    role: "user",
                });
            },
        });
    };

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link to={"/admin"} className="p-2 hover:bg-gray-100 rounded cursor-pointer">
                    <Home className="w-5 h-5" />
                </Link>
                <h1 className="text-xl sm:text-2xl font-bold">User Management</h1>
            </div>

            <div className="bg-white p-4 sm:p-6 shadow rounded-lg mb-6">
                <h2 className="text-lg font-semibold mb-4">Add New User</h2>
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleAddUser}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        value={newUser.address}
                        onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                        className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button
                        type="submit"
                        disabled={createUserMutation.isLoading}
                        className="bg-black text-white rounded-lg px-6 py-3 font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:col-span-2"
                    >
                        {createUserMutation.isLoading ? "Creating..." : "Create User"}
                    </button>
                </form>
            </div>

            <div className="bg-white p-4 sm:p-6 shadow rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Filter by {filterBy}</h2>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <select
                        value={filterBy}
                        onChange={(e) => {
                            setFilterBy(e.target.value);
                            setSearchValue("");
                        }}
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-48"
                    >
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="address">Address</option>
                        <option value="minRating">Rating</option>
                        <option value="role">Role</option>
                    </select>

                    {filterBy === "minRating" ? (
                        <select
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="border border-gray-300 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Ratings</option>
                            {[1, 2, 3, 4, 5].map((r) => (
                                <option key={r} value={r}>
                                    {r} ⭐
                                </option>
                            ))}
                        </select>
                    ) : filterBy === "role" ? (
                        <select
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="border border-gray-300 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Roles</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    ) : (
                        <input
                            type="text"
                            placeholder={`Filter by ${filterBy}...`}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="border border-gray-300 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                        <span className="ml-2">Loading users...</span>
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block">
                            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-4 border-b border-gray-200 text-left font-semibold">Name</th>
                                        <th className="p-4 border-b border-gray-200 text-left font-semibold">Email</th>
                                        <th className="p-4 border-b border-gray-200 text-left font-semibold">Address</th>
                                        <th className="p-4 border-b border-gray-200 text-left font-semibold">Role</th>
                                        <th className="p-4 border-b border-gray-200 text-left font-semibold">Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userList?.users?.map((u, index) => (
                                        <tr key={u.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                            <td className="p-4 border-b border-gray-200">{u.name}</td>
                                            <td className="p-4 border-b border-gray-200">{u.email}</td>
                                            <td className="p-4 border-b border-gray-200">{u.address}</td>
                                            <td className="p-4 border-b border-gray-200">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${u.role === 'admin'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="p-4 border-b border-gray-200">
                                                {u.ownedStore?.averageRating
                                                    ? u.ownedStore.averageRating.toFixed(1)
                                                    : "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden space-y-4">
                            {userList?.users?.map((u) => (
                                <div key={u.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-lg">{u.name}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p><span className="font-medium">Email:</span> {u.email}</p>
                                        <p><span className="font-medium">Address:</span> {u.address}</p>
                                        <p><span className="font-medium">Rating:</span> {
                                            u.ownedStore?.averageRating
                                                ? u.ownedStore.averageRating.toFixed(1)
                                                : "-"
                                        }</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-6">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                            >
                                Prev
                            </button>

                            <div className="flex gap-1">
                                {[...Array(userList?.pagination?.pages || 1)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${page === i + 1
                                                ? "bg-black text-white"
                                                : "bg-gray-200 hover:bg-gray-300"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                disabled={page === userList?.pagination?.pages}
                                onClick={() => setPage((old) => Math.min(old + 1, userList?.pagination?.pages))}
                                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>

    );
};

export default UserManagement;
