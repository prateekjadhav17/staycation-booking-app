import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Star, Trash2, Edit, User, AlertCircle, RefreshCw, ChevronLeft } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const ListingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [listing, setListing] = useState(null);
    const [mapToken, setMapToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Review form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState(null);

    const mapContainer = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/listings/${id}`);
                setListing(response.data.listing);
                setMapToken(response.data.mapToken);
                setError(null);
            } catch (err) {
                console.error("Error fetching listing details:", err);
                setError(err.response?.data?.error || "Could not retrieve listing details.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    // Mapbox Initialization
    useEffect(() => {
        if (loading || !listing || !mapToken || !mapContainer.current) return;
        
        const coords = listing.geometry?.coordinates;
        if (!coords || coords.length !== 2) return;

        try {
            mapboxgl.accessToken = mapToken;
            
            // Clean up old map if it exists
            if (mapInstance.current) {
                mapInstance.current.remove();
            }

            mapInstance.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: coords,
                zoom: 11,
                scrollZoom: false // disable scrolling zoom for better page scroll UX
            });

            // Add navigation controls (zoom in/out)
            mapInstance.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

            // Add marker
            new mapboxgl.Marker({ color: '#f43f5e' }) // Rose-500 color marker
                .setLngLat(coords)
                .setPopup(
                    new mapboxgl.Popup({ offset: 30 }).setHTML(
                        `<h4 class="font-bold text-gray-900">${listing.title}</h4><p class="text-xs text-gray-600 mt-1">Exact location will be provided after booking!</p>`
                    )
                )
                .addTo(mapInstance.current);

        } catch (err) {
            console.error("Mapbox load failed:", err);
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [loading, listing, mapToken]);

    const handleDeleteListing = async () => {
        if (!window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;
        try {
            await api.delete(`/listings/${id}`);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.error || "Failed to delete listing.");
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            setReviewError("Please write a comment.");
            return;
        }

        try {
            setSubmittingReview(true);
            setReviewError(null);
            const response = await api.post(`/listings/${id}/reviews`, {
                review: { rating, comment }
            });
            
            // Append review to list locally
            setListing(prev => ({
                ...prev,
                reviews: [...prev.reviews, response.data.review]
            }));
            
            // Reset form
            setComment('');
            setRating(5);
        } catch (err) {
            setReviewError(err.response?.data?.error || "Failed to submit review.");
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            await api.delete(`/listings/${id}/reviews/${reviewId}`);
            
            // Remove review locally
            setListing(prev => ({
                ...prev,
                reviews: prev.reviews.filter(r => r._id !== reviewId)
            }));
        } catch (err) {
            alert(err.response?.data?.error || "Failed to delete review.");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <RefreshCw className="h-10 w-10 text-rose-500 animate-spin" />
                <span className="text-gray-500 font-medium">Loading details...</span>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="max-w-md mx-auto my-12 text-center p-6 border border-rose-200 bg-rose-50 rounded-2xl shadow-sm">
                <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Listing Not Found</h3>
                <p className="text-sm text-gray-600 mb-6">{error || "The property you're looking for does not exist."}</p>
                <Link to="/" className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-semibold transition-colors">
                    Back to Explore
                </Link>
            </div>
        );
    }

    const isListingOwner = user && listing.owner && (listing.owner._id === user._id || listing.owner === user._id);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back link */}
            <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-rose-500 transition-colors mb-6">
                <ChevronLeft className="h-4 w-4" /> Back to listings
            </Link>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
                {listing.title}
            </h1>

            {/* Main Listing Card */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xs mb-8">
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                        src={listing.image?.url}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8">
                    {/* Owner Badge */}
                    <div className="flex items-center gap-3 pb-6 border-b border-gray-100 mb-6">
                        <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg uppercase shadow-inner">
                            {listing.owner?.username ? listing.owner.username.slice(0, 2) : 'OW'}
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Hosted by</div>
                            <div className="font-semibold text-gray-900">{listing.owner?.username || "Property Host"}</div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-xl p-3 flex flex-col justify-center border border-gray-100">
                            <span className="text-xs text-gray-400 font-semibold">Price per night</span>
                            <span className="text-lg font-bold text-gray-900 mt-1">₹ {listing.price?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 flex flex-col justify-center border border-gray-100">
                            <span className="text-xs text-gray-400 font-semibold flex items-center gap-1"><MapPin className="h-3 w-3 text-rose-500" /> Location</span>
                            <span className="text-sm font-semibold text-gray-900 mt-1 truncate">{listing.location}</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 flex flex-col justify-center border border-gray-100 col-span-2 sm:col-span-1">
                            <span className="text-xs text-gray-400 font-semibold">Country</span>
                            <span className="text-sm font-semibold text-gray-900 mt-1">{listing.country}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-3">About this place</h3>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                            {listing.description}
                        </p>
                    </div>

                    {/* Owner Controls */}
                    {isListingOwner && (
                        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                            <Link
                                to={`/listings/${id}/edit`}
                                className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg text-sm transition-all"
                            >
                                <Edit className="h-4 w-4" /> Edit
                            </Link>
                            <button
                                onClick={handleDeleteListing}
                                className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg text-sm transition-all"
                            >
                                <Trash2 className="h-4 w-4" /> Delete Listing
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Review Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs mb-8">
                {/* Leave a review */}
                {user ? (
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Leave a Review</h3>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            {reviewError && (
                                <div className="p-3 bg-red-50 text-red-600 text-xs font-medium rounded-lg flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    {reviewError}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="p-1 hover:scale-110 transition-transform"
                                        >
                                            <Star
                                                className={`h-7 w-7 ${
                                                    star <= rating
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-300 hover:text-yellow-300'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                                    Comment
                                </label>
                                <textarea
                                    id="comment"
                                    rows="4"
                                    required
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us about your experience..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={submittingReview}
                                className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg text-sm transition-all disabled:opacity-50"
                            >
                                {submittingReview ? "Submitting..." : "Submit Review"}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
                        <p className="text-gray-600 text-sm">
                            You must be <Link to="/login" className="text-rose-500 font-semibold hover:underline">signed in</Link> to leave a review.
                        </p>
                    </div>
                )}

                <hr className="border-gray-200 my-6" />

                {/* All Reviews */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Reviews</h3>
                    {listing.reviews?.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">No reviews yet for this listing. Be the first to add one!</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {listing.reviews?.map((review) => {
                                const isAuthor = user && review.author && (review.author._id === user._id || review.author === user._id);
                                return (
                                    <div key={review._id} className="border border-gray-200 bg-gray-50/50 rounded-xl p-4 flex flex-col justify-between hover:border-gray-300 transition-colors">
                                        <div>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-semibold text-gray-900 text-sm">
                                                    @{review.author?.username || "Guest User"}
                                                </span>
                                                <div className="flex items-center text-yellow-400">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-3.5 w-3.5 ${
                                                                i < review.rating
                                                                    ? 'fill-yellow-400'
                                                                    : 'text-gray-200'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm mt-2.5 whitespace-pre-wrap leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>
                                        
                                        {isAuthor && (
                                            <div className="flex justify-end mt-4 pt-2 border-t border-gray-100">
                                                <button
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    className="text-red-500 hover:text-red-700 flex items-center gap-1 text-xs font-semibold hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Map Area */}
            {listing.geometry?.coordinates?.length === 2 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-1.5">
                        <MapPin className="h-5 w-5 text-rose-500" />
                        Where you'll be
                    </h3>
                    <div className="w-full h-80 sm:h-96 rounded-xl overflow-hidden shadow-inner border border-gray-200 relative bg-gray-100">
                        {/* Map container */}
                        <div ref={mapContainer} className="w-full h-full" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListingDetails;
