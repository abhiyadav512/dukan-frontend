import { useState } from "react";
import { Eye, EyeOff, Loader2, UserPlus, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useRegitser } from "../../../hooks/useAuth";

const Register = () => {
    const registerUser = useRegitser();
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = (e) => {
        e.preventDefault();
        registerUser.mutate(form);
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md p-6 border rounded-lg shadow-md">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">Register</h1>
                    <p className="text-sm">Sign up with your details below</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Name */}
                    <div className="flex flex-col">
                        <label htmlFor="username">Username</label>
                        <div className="relative">
                            <input
                                id="username"
                                type="text"
                                name="name"
                                placeholder="Your username"
                                onChange={handleChange}
                                value={form.name}
                                required
                                className="w-full pl-10 pr-2 py-2 border rounded"
                            />
                            <User className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4" />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="flex flex-col">
                        <label htmlFor="address">Address</label>
                        <div className="relative">
                            <input
                                id="address"
                                type="text"
                                name="address"
                                placeholder="Your address"
                                onChange={handleChange}
                                value={form.address}
                                required
                                className="w-full pl-10 pr-2 py-2 border rounded"
                            />
                            <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4" />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label htmlFor="email">Email</label>
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                onChange={handleChange}
                                value={form.email}
                                required
                                className="w-full pl-10 pr-2 py-2 border rounded"
                            />
                            <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4" />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="flex flex-col">
                        <label htmlFor="password">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                onChange={handleChange}
                                value={form.password}
                                required
                                className="w-full pl-10 pr-10 py-2 border rounded"
                            />
                            <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4" />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 border rounded flex items-center justify-center"
                        disabled={registerUser.isPending}
                    >
                        {registerUser.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Sign Up
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
