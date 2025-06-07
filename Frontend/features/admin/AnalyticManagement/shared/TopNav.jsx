import React from "react";

// Top Navigation Component
const TopNav = ({ setActiveSection, activeSection }) => (
  <nav className="bg-white shadow sticky top-0 z-10 w-full overflow-x-hidden">
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
      <div className="flex h-14 sm:h-16 w-full">
        <div className="flex overflow-x-auto scrollbar-hide w-full">
          <div className="flex space-x-1 sm:space-x-4 lg:space-x-8 min-w-max px-1">
            {[
              "dashboard",
              "products",
              // "orders",
              // "users",
              // "reviews",
              "coupons",
            ].map((section) => (
              <button
                key={section}
                className={`inline-flex items-center px-1 sm:px-2 pt-1 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                  activeSection === section
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
                onClick={() => setActiveSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </nav>
);

export default TopNav;
