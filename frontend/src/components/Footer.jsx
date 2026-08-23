import React from 'react';
import { Compass, Globe, Shield, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center text-white font-bold text-xl gap-2 hover:text-rose-400 transition-colors">
                            <Compass className="h-6 w-6 text-rose-500" />
                            <span>Wanderlust</span>
                        </Link>
                        <p className="text-sm text-gray-500">
                            Discover and host unique homes around the world. Your next adventure awaits.
                        </p>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">AirCover</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cancellation options</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Safety information</a></li>
                        </ul>
                    </div>

                    {/* Hosting */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Hosting</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/listings/new" className="hover:text-white transition-colors">Host your home</Link></li>
                            <li><a href="#" className="hover:text-white transition-colors">Wanderlust Cover for Hosts</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Hosting resources</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Community forum</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><Shield className="h-4 w-4 text-gray-500" /> Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><Scale className="h-4 w-4 text-gray-500" /> Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><Globe className="h-4 w-4 text-gray-500" /> Company Details</a></li>
                        </ul>
                    </div>
                </div>

                <hr className="border-gray-800 my-8" />

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Wanderlust Private Limited. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        {/* Facebook */}
                        <a href="#" className="text-gray-500 hover:text-white transition-colors" aria-label="Facebook">
                            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                            </svg>
                        </a>
                        {/* Instagram */}
                        <a href="#" className="text-gray-500 hover:text-white transition-colors" aria-label="Instagram">
                            <svg className="h-5 w-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                            </svg>
                        </a>
                        {/* Linkedin */}
                        <a href="#" className="text-gray-500 hover:text-white transition-colors" aria-label="Linkedin">
                            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
