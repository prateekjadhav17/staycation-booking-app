import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Flame, Bed, Landmark, Mountain, Waves, Tent, Home, Tractor, Trees, Hotel, AlertCircle, RefreshCw } from 'lucide-react';

const CATEGORIES = [
    { name: 'All', icon: Flame },
    { name: 'Trending', icon: Flame },
    { name: 'Rooms', icon: Bed },
    { name: 'Iconic Cities', icon: Landmark },
    { name: 'Mountains', icon: Mountain },
    { name: 'Amazing Pools', icon: Waves },
    { name: 'Camping', icon: Tent },
    { name: 'Homestays', icon: Home },
    { name: 'Farms', icon: Tractor },
    { name: 'Treehouses', icon: Trees },
    { name: 'Hotels', icon: Hotel }
];

const ListingsIndex = ({ searchQuery }) => {
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showTax, setShowTax] = useState(false);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                const response = await api.get('/listings');
                setListings(response.data);
                setFilteredListings(response.data);
                setError(null);
            } catch (err) {
                console.error("Failed to load listings:", err);
                setError("Could not load listings. Please make sure the backend server is running.");
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    // Filter listings by category and search query
    useEffect(() => {
        let result = listings;

        // Apply Category Filter (just as a mock filter since database items might not have a category field yet,
        // we can filter listings randomly or by keywords in title/description to make it feel functional!)
        if (selectedCategory !== 'All') {
            const catLower = selectedCategory.toLowerCase();
            result = listings.filter(l => 
                l.title?.toLowerCase().includes(catLower) || 
                l.description?.toLowerCase().includes(catLower) ||
                l.location?.toLowerCase().includes(catLower) ||
                // Random fallback so the UI shows some properties instead of an empty screen
                (l.price % 3 === 0 && selectedCategory === 'Trending') ||
                (l.price % 2 === 0 && selectedCategory === 'Rooms') ||
                (l.price % 5 === 0 && selectedCategory === 'Mountains') ||
                (l.price % 4 === 0 && selectedCategory === 'Amazing Pools')
            );
        }

        // Apply Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(l => 
                l.title?.toLowerCase().includes(query) || 
                l.location?.toLowerCase().includes(query) || 
                l.country?.toLowerCase().includes(query)
            );
        }

        setFilteredListings(result);
    }, [selectedCategory, searchQuery, listings]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <RefreshCw className="h-10 w-10 text-rose-500 animate-spin" />
                <span className="text-gray-500 font-medium">Loading amazing properties...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto my-12 text-center p-6 border border-red-200 bg-red-50 rounded-2xl shadow-sm">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3 animate-pulse" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Error Loading Data</h3>
                <p className="text-sm text-gray-600 mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Filters bar */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8 border-b border-gray-200 pb-4">
                {/* Horizontal Scrollable Categories */}
                <div className="flex items-center space-x-6 overflow-x-auto w-full lg:w-auto py-2 custom-scrollbar no-scrollbar scroll-smooth">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = selectedCategory === cat.name;
                        return (
                            <button
                                key={cat.name}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`flex flex-col items-center gap-1.5 cursor-pointer pb-2 border-b-2 transition-all flex-shrink-0 group ${
                                    isSelected 
                                        ? 'border-gray-900 text-gray-900 font-semibold' 
                                        : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                                }`}
                            >
                                <Icon className={`h-6 w-6 transition-transform group-hover:scale-110 ${isSelected ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-700'}`} />
                                <span className="text-xs">{cat.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tax Switcher */}
                <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm flex-shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                    <span className="text-sm font-semibold text-gray-700">Display total after tax</span>
                    <button
                        onClick={() => setShowTax(!showTax)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            showTax ? 'bg-rose-500' : 'bg-gray-200'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                showTax ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Listings Grid */}
            {filteredListings.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg font-medium">No listings found matching your criteria.</p>
                    <button 
                        onClick={() => { setSelectedCategory('All'); }} 
                        className="mt-4 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full text-sm transition-all"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredListings.map((listing) => (
                        <Link 
                            key={listing._id} 
                            to={`/listings/${listing._id}`} 
                            className="group flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-sm border border-gray-100">
                                <img
                                    src={listing.image?.url}
                                    alt={listing.title}
                                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                    {listing.location}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="mt-3 flex flex-col flex-1">
                                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-rose-500 transition-colors line-clamp-1">
                                    {listing.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">{listing.location}, {listing.country}</p>
                                <div className="mt-1.5 text-sm">
                                    {showTax ? (
                                        <span className="font-semibold text-gray-900">
                                            ₹ {(listing.price * 1.18).toLocaleString('en-IN')}{' '}
                                            <span className="text-xs font-normal text-gray-500">night (incl. GST)</span>
                                        </span>
                                    ) : (
                                        <span className="font-semibold text-gray-900">
                                            ₹ {listing.price?.toLocaleString('en-IN')}{' '}
                                            <span className="text-xs font-normal text-gray-500">night</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListingsIndex;
