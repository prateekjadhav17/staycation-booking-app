import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Upload, ChevronLeft, MapPin, DollarSign, FileText, Globe, RefreshCw, AlertCircle } from 'lucide-react';

const ListingForm = () => {
    const { id } = useParams(); // exists only if in edit mode
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const isEditMode = !!id;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [country, setCountry] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    
    const [fetchingListing, setFetchingListing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Redirect guest users away from listing form
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    // Fetch listing details if in Edit Mode
    useEffect(() => {
        if (!isEditMode) return;

        const fetchListing = async () => {
            try {
                setFetchingListing(true);
                const response = await api.get(`/listings/${id}`);
                const listing = response.data.listing;
                
                // Verify ownership (optional check, backend also enforces)
                if (user && listing.owner && listing.owner._id !== user._id && listing.owner !== user._id) {
                    navigate('/');
                    return;
                }

                setTitle(listing.title || '');
                setDescription(listing.description || '');
                setPrice(listing.price || '');
                setLocation(listing.location || '');
                setCountry(listing.country || '');
                if (listing.image?.url) {
                    setImagePreview(listing.image.url);
                }
            } catch (err) {
                console.error("Failed to load listing for edit:", err);
                setError("Could not load the requested listing data.");
            } finally {
                setFetchingListing(false);
            }
        };
        fetchListing();
    }, [id, isEditMode, user, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim() || !description.trim() || !price || !location.trim() || !country.trim()) {
            setError("All fields are required.");
            return;
        }

        // Validate image file for new listing
        if (!isEditMode && !imageFile) {
            setError("Please upload an image for your listing.");
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            
            // Build multipart form data
            const formData = new FormData();
            formData.append('listing[title]', title.trim());
            formData.append('listing[description]', description.trim());
            formData.append('listing[price]', Number(price));
            formData.append('listing[location]', location.trim());
            formData.append('listing[country]', country.trim());
            
            if (imageFile) {
                formData.append('listing[image]', imageFile);
            }

            let response;
            if (isEditMode) {
                response = await api.put(`/listings/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                response = await api.post('/listings', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            const targetId = isEditMode ? id : response.data.listing._id;
            navigate(`/listings/${targetId}`);
        } catch (err) {
            console.error("Form submit error:", err);
            setError(err.response?.data?.error || "An error occurred while saving the listing.");
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || fetchingListing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <RefreshCw className="h-10 w-10 text-rose-500 animate-spin" />
                <span className="text-gray-500 font-medium">Preparing your workspace...</span>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link 
                to={isEditMode ? `/listings/${id}` : '/'} 
                className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-rose-500 transition-colors mb-6"
            >
                <ChevronLeft className="h-4 w-4" /> Cancel
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">
                {isEditMode ? "Edit your listing" : "Create a new listing"}
            </h1>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl mb-6 flex items-start gap-2.5 text-sm font-medium">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-gray-400" /> Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        required
                        placeholder="e.g. Modern Beachside Villa"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm transition-all"
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-1.5">
                        Description
                    </label>
                    <textarea
                        id="description"
                        required
                        rows="5"
                        placeholder="Write details about amenities, layout, surroundings, etc."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm transition-all"
                    ></textarea>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2.5 flex items-center gap-1.5">
                        <Upload className="h-4 w-4 text-gray-400" /> Property Image
                    </label>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Preview */}
                        {imagePreview && (
                            <div className="h-28 w-44 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                            </div>
                        )}
                        
                        <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-rose-500 rounded-xl p-4 cursor-pointer bg-gray-50/50 hover:bg-rose-50/10 transition-colors">
                            <Upload className="h-6 w-6 text-gray-400 mb-1" />
                            <span className="text-sm font-semibold text-rose-500">Choose an image file</span>
                            <span className="text-xs text-gray-400 mt-0.5">JPEG, PNG up to 10MB</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* Price, Country, Location grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                            <DollarSign className="h-4 w-4 text-gray-400" /> Price (₹ per night)
                        </label>
                        <input
                            type="number"
                            id="price"
                            required
                            min="0"
                            placeholder="e.g. 2500"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm transition-all"
                        />
                    </div>

                    {/* Country */}
                    <div>
                        <label htmlFor="country" className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                            <Globe className="h-4 w-4 text-gray-400" /> Country
                        </label>
                        <input
                            type="text"
                            id="country"
                            required
                            placeholder="e.g. India"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm transition-all"
                        />
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label htmlFor="location" className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-gray-400" /> Location / City
                    </label>
                    <input
                        type="text"
                        id="location"
                        required
                        placeholder="e.g. Goa, Calangute"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm transition-all"
                    />
                </div>

                {/* Buttons */}
                <div className="pt-4 flex gap-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-sm hover:shadow disabled:opacity-50 flex items-center justify-center"
                    >
                        {submitting ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : isEditMode ? (
                            "Update Listing"
                        ) : (
                            "Create Listing"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ListingForm;
