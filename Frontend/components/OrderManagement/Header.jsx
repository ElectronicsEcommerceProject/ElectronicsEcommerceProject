import React from 'react';
import { ChevronRight } from 'lucide-react'; // Using lucide-react icons (if installed)

const Header = () => (
    <header className="bg-gradient-to-r from-white to-gray-50 shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>

            <nav className="mt-4 flex items-center text-sm text-gray-600">
                <a href="#" className="hover:text-blue-600 transition font-medium">Home</a>
                <ChevronRight size={16} className="mx-2 text-gray-400" />
                <a href="#" className="hover:text-blue-600 transition font-medium">Dashboard</a>
                <ChevronRight size={16} className="mx-2 text-gray-400" />
                <span className="text-gray-900 font-semibold">Order Management</span>
            </nav>
        </div>
    </header>
);

export default Header;
