import React from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useAuth";
import { useAdminDashboard } from "../../hooks/useAdmin";
import { Home } from "lucide-react";

const AdminDashboard = () => {
    const logout = useLogout();
    const { data: dashboardData, isLoading, isError, error } = useAdminDashboard();

    return (
        <div className="p-6">
            <Link to={"/"}><Home /></Link>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={logout}
                    className="bg-black text-white rounded-xl px-4 py-2"
                >
                    Logout
                </button>
            </div>

            {isLoading && (
                <p className="text-gray-500">Loading data...</p>
            )}

            {isError && (
                <p className="text-red-500">
                    Failed to load dashboard data: {error?.message || "Unknown error"}
                </p>
            )}

            {!isLoading && !isError && dashboardData && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 shadow rounded">
                        <h2 className="text-lg font-semibold">Total Users</h2>
                        <p className="text-2xl">{dashboardData?.dashboard?.totalUsers ?? 0}</p>
                    </div>
                    <div className="bg-white p-4 shadow rounded">
                        <h2 className="text-lg font-semibold">Total Stores</h2>
                        <p className="text-2xl">{dashboardData?.dashboard?.totalStores ?? 0}</p>
                    </div>
                    <div className="bg-white p-4 shadow rounded">
                        <h2 className="text-lg font-semibold">Total Ratings</h2>
                        <p className="text-2xl">{dashboardData?.dashboard.totalRatings ?? 0}</p>
                    </div>
                </div>
            )}

            {!isLoading && !isError && !dashboardData && (
                <p className="text-gray-500">No dashboard data available.</p>
            )}

            <div className="flex gap-4">
                <Link
                    to="/admin/users"
                    className="bg-black text-white rounded-xl px-4 py-2"
                >
                    Manage Users
                </Link>
                <Link
                    to="/admin/stores"
                    className="bg-black text-white rounded-xl px-4 py-2"
                >
                    Manage Stores
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;