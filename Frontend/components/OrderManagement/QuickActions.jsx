import React from "react";
import { PlusCircle } from "lucide-react"; // Ensure Lucide is installed

const QuickActions = ({ setShowCreateOrderModal }) => {
  return (
    <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 lg:right-4 lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto z-50">
      <button
        onClick={() => setShowCreateOrderModal(true)}
        className="bg-green-600 text-white rounded-full p-3 sm:p-4 shadow-xl transform transition duration-300 ease-in-out hover:scale-110 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 flex items-center justify-center"
        title="Create Manual Order"
      >
        <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};

export default QuickActions;
