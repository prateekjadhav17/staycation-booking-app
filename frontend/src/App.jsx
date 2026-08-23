import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import ListingsIndex from './pages/ListingsIndex';
import ListingDetails from './pages/ListingDetails';
import ListingForm from './pages/ListingForm';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
          {/* Header/Navbar */}
          <Navbar onSearch={handleSearch} />

          {/* Main Content */}
          <main className="flex-grow">
            <Routes>
              {/* Home / Explore */}
              <Route path="/" element={<ListingsIndex searchQuery={searchQuery} />} />
              <Route path="/listings" element={<Navigate to="/" replace />} />

              {/* Listing Details */}
              <Route path="/listings/:id" element={<ListingDetails />} />

              {/* Listing Host Create/Edit */}
              <Route path="/listings/new" element={<ListingForm />} />
              <Route path="/listings/:id/edit" element={<ListingForm />} />

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Fallback Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
