import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Search, Menu, X, PlusCircle, LogOut, User, LogIn, UserPlus } from 'lucide-react';

const Navbar = ({ onSearch }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        }
        navigate('/');
    };

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            navigate('/');
        }
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Brand/Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center text-rose-500 hover:text-rose-600 transition-colors font-bold text-2xl gap-2">
                            <Compass className="h-8 w-8 animate-spin-slow" />
                            <span className="hidden sm:inline-block tracking-tight">Wanderlust</span>
                        </Link>
                        <div className="hidden md:flex ml-8 space-x-4">
                            <Link to="/" className="text-gray-700 hover:text-rose-500 px-3 py-2 rounded-md text-sm font-semibold transition-colors">
                                Explore
                            </Link>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search destinations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm shadow-sm transition-all"
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-rose-500 rounded-full text-white hover:bg-rose-600 transition-colors shadow-sm">
                                <Search className="h-4 w-4" />
                            </button>
                        </div>
                    </form>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/listings/new" className="flex items-center gap-1.5 text-gray-700 hover:text-rose-500 px-3 py-2 rounded-md text-sm font-semibold transition-colors">
                            <PlusCircle className="h-4 w-4" />
                            Host your home
                        </Link>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                    <div className="h-7 w-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm shadow-inner uppercase">
                                        {user.username.slice(0, 2)}
                                    </div>
                                    <span className="max-w-[100px] truncate">{user.username}</span>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-md text-sm font-semibold transition-all border border-transparent hover:border-red-100"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-rose-500 px-3 py-2 rounded-md text-sm font-semibold transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden gap-2">
                        {/* Compact Search Trigger on Mobile */}
                        <form onSubmit={handleSearchSubmit} className="flex items-center max-w-[180px]">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-3 pr-8 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 text-xs shadow-inner"
                                />
                                <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 bg-rose-500 rounded-full text-white">
                                    <Search className="h-3 w-3" />
                                </button>
                            </div>
                        </form>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-rose-500 hover:bg-gray-100 focus:outline-none transition-all"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white absolute w-full left-0 z-40 shadow-lg py-4 px-2 space-y-2 animate-fade-in-down">
                    <Link
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-md text-base font-semibold text-gray-700 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                    >
                        Explore
                    </Link>
                    <Link
                        to="/listings/new"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 rounded-md text-base font-semibold text-gray-700 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                    >
                        <PlusCircle className="h-5 w-5" />
                        Host your home
                    </Link>

                    <hr className="border-gray-100 my-2" />

                    {user ? (
                        <div className="space-y-2">
                            <div className="px-4 py-2 flex items-center gap-2 text-gray-700">
                                <div className="h-8 w-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm uppercase">
                                    {user.username.slice(0, 2)}
                                </div>
                                <div>
                                    <div className="font-semibold text-sm leading-none">{user.username}</div>
                                    <div className="text-xs text-gray-400 mt-1">{user.email}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                className="flex w-full items-center gap-2 px-4 py-3 rounded-md text-base font-semibold text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2 p-2">
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex justify-center items-center gap-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all text-center"
                            >
                                <LogIn className="h-4 w-4" />
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex justify-center items-center gap-1 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-semibold transition-all shadow-sm text-center"
                            >
                                <UserPlus className="h-4 w-4" />
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
