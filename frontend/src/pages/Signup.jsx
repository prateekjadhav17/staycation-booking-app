import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, UserPlus, Lock, Mail, User, AlertCircle, RefreshCw } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const { user, signup, loading: authLoading } = useAuth();
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Redirect to home if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            navigate('/');
        }
    }, [user, authLoading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim() || !email.trim() || !password) {
            setError("All fields are required.");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const result = await signup(username.trim(), email.trim(), password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError("An unexpected error occurred during signup.");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <RefreshCw className="h-10 w-10 text-rose-500 animate-spin" />
                <span className="text-gray-500 font-medium">Checking session...</span>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50/50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link to="/" className="inline-flex items-center text-rose-500 font-bold text-3xl gap-2 mb-4">
                    <Compass className="h-9 w-9" />
                    <span>Wanderlust</span>
                </Link>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    Create an account
                </h2>
                <p className="mt-1.5 text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-rose-500 hover:text-rose-600 transition-colors">
                        Log in here
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 border border-gray-200 sm:rounded-2xl sm:px-10 shadow-xs">
                    {error && (
                        <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl mb-5 flex items-start gap-2 text-xs font-semibold">
                            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                                <User className="h-4 w-4 text-gray-400" /> Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm transition-all"
                                placeholder="Choose a username"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                                <Mail className="h-4 w-4 text-gray-400" /> Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm transition-all"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                                <Lock className="h-4 w-4 text-gray-400" /> Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm transition-all"
                                placeholder="Create a strong password"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-sm hover:shadow disabled:opacity-50"
                            >
                                {loading ? (
                                    <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                                ) : (
                                    <>
                                        <UserPlus className="h-4.5 w-4.5" />
                                        Sign Up
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
