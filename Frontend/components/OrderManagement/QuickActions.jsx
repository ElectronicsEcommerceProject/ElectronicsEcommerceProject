import React from 'react';
import { PlusCircle } from 'lucide-react'; // Ensure Lucide is installed

const QuickActions = ({ setShowCreateOrderModal }) => {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 transform">
      <button
        onClick={() => setShowCreateOrderModal(true)}
        className="bg-green-600 text-white rounded-full p-2 shadow-xl transform transition duration-300 ease-in-out hover:scale-125 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 flex items-center justify-center"
        title="Create Manual Order"
      >
        <PlusCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

export default QuickActions;
