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
        <div className="p-6">
            <div className="flex gap-4">
                <Link to={"/admin"}>
                    <Home />
                </Link>
                <h1 className="text-xl font-bold mb-4">User Management</h1>
            </div>

            <div className="bg-white p-4 shadow rounded mb-6">
                <h2 className="text-lg font-semibold mb-4">Add New User</h2>
                <form className="grid grid-cols-2 gap-4" onSubmit={handleAddUser}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newUser.name}
                        onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                        }
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                        }
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) =>
                            setNewUser({ ...newUser, password: e.target.value })
                        }
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        value={newUser.address}
                        onChange={(e) =>
                            setNewUser({ ...newUser, address: e.target.value })
                        }
                        className="border p-2 rounded"
                        required
                    />
                    <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="border p-2 rounded"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button
                        type="submit"
                        disabled={createUserMutation.isLoading}
                        className="bg-black text-white rounded-xl px-4 py-2 col-span-2"
                    >
                        {createUserMutation.isLoading ? "Creating..." : "Create User"}
                    </button>
                </form>
            </div>

            <div className="bg-white p-4 shadow rounded">
                <h2 className="text-lg font-semibold mb-4">Filter by {filterBy}</h2>

                <div className="flex gap-2 mb-4">
                    <select
                        value={filterBy}
                        onChange={(e) => {
                            setFilterBy(e.target.value);
                            setSearchValue("");
                        }}
                        className="border p-2 rounded"
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
                            className="border p-2 rounded flex-1"
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
                            className="border p-2 rounded flex-1"
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
                            className="border p-2 rounded flex-1"
                        />
                    )}

                </div>

                {isLoading ? (
                    <p>Loading users...</p>
                ) : (
                    <>
                        <table className="w-full border">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border">Name</th>
                                    <th className="p-2 border">Email</th>
                                    <th className="p-2 border">Address</th>
                                    <th className="p-2 border">Role</th>
                                    <th className="p-2 border">Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userList?.users?.map((u) => (
                                    <tr key={u.id}>
                                        <td className="p-2 border">{u.name}</td>
                                        <td className="p-2 border">{u.email}</td>
                                        <td className="p-2 border">{u.address}</td>
                                        <td className="p-2 border">{u.role}</td>
                                        <td className="p-2 border">
                                            {u.ownedStore?.averageRating
                                                ? u.ownedStore.averageRating.toFixed(1)
                                                : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-center items-center gap-2 mt-4">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            >
                                Prev
                            </button>

                            {[...Array(userList?.pagination?.pages || 1)].map((_, i) => (
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
                                disabled={page === userList?.pagination?.pages}
                                onClick={() =>
                                    setPage((old) =>
                                        Math.min(old + 1, userList?.pagination?.pages)
                                    )
                                }
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
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
