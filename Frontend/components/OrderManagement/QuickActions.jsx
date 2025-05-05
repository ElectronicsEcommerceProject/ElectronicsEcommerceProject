import React from 'react';

const QuickActions = ({ setShowCreateOrderModal }) => (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
        <button
            className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
            onClick={() => setShowCreateOrderModal(true)}
            title="Create Manual Order"
        >
            <i className="fas fa-plus"></i>
        </button>
    </div>
);

export default QuickActions;