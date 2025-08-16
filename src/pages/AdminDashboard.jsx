import React from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useAuth";
import { useAdminDashboard } from "../../hooks/useAdmin";
import { Home } from "lucide-react";

const AdminDashboard = () => {
    const logout = useLogout();
    const { data: dashboardData, isLoading, isError, error } = useAdminDashboard();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <Link to={"/"}>
                    <Home className="w-5 h-5 md:w-6 md:h-6" />
                </Link>
                <div className="flex justify-between items-center w-full">
                    <h1 className="text-xl md:text-2xl font-bold">Admin Dashboard</h1>
                    <button
                        onClick={logout}
                        className="bg-black text-white rounded-lg px-3 py-1.5 md:px-4 md:py-2 hover:bg-gray-800 transition text-sm md:text-base"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {isLoading && <p className="text-gray-500 text-sm md:text-base">Loading data...</p>}
            {isError && (
                <p className="text-red-500 text-sm md:text-base">
                    Failed to load dashboard data: {error?.message || "Unknown error"}
                </p>
            )}

            {!isLoading && !isError && dashboardData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
                    <div className="bg-white p-4 md:p-6 shadow rounded-lg md:rounded-xl text-center">
                        <h2 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Total Users</h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {dashboardData?.dashboard?.totalUsers ?? 0}
                        </p>
                    </div>
                    <div className="bg-white p-4 md:p-6 shadow rounded-lg md:rounded-xl text-center">
                        <h2 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Total Stores</h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {dashboardData?.dashboard?.totalStores ?? 0}
                        </p>
                    </div>
                    <div className="bg-white p-4 md:p-6 shadow rounded-lg md:rounded-xl text-center">
                        <h2 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Total Ratings</h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {dashboardData?.dashboard?.totalRatings ?? 0}
                        </p>
                    </div>
                </div>
            )}

            {!isLoading && !isError && !dashboardData && (
                <p className="text-gray-500 text-sm md:text-base">No dashboard data available.</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link
                    to="/admin/users"
                    className="bg-black text-white rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-center hover:bg-gray-800 transition text-sm md:text-base"
                >
                    Manage Users
                </Link>
                <Link
                    to="/admin/stores"
                    className="bg-black text-white rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-center hover:bg-gray-800 transition text-sm md:text-base"
                >
                    Manage Stores
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
