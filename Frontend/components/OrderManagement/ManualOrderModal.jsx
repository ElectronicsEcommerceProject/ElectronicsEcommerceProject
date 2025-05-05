import React from 'react';

const ManualOrderModal = ({ showCreateOrderModal, setShowCreateOrderModal, createOrder }) => (
    showCreateOrderModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Create Manual Order</h2>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setShowCreateOrderModal(false)}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        createOrder({
                            customer: formData.get('customer'),
                            email: formData.get('email'),
                            phone: formData.get('phone'),
                            address: formData.get('address'),
                            items: [
                                {
                                    name: formData.get('itemName'),
                                    qty: Number(formData.get('itemQty')),
                                    price: Number(formData.get('itemPrice')),
                                },
                            ],
                        });
                    }}
                >
                    <div className="grid grid-cols-1 gap-4">
                        <input
                            type="text"
                            name="customer"
                            placeholder="Customer Name"
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Customer Email"
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Customer Phone"
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Customer Address"
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                type="text"
                                name="itemName"
                                placeholder="Item Name"
                                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="number"
                                name="itemQty"
                                placeholder="Quantity"
                                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="number"
                                name="itemPrice"
                                placeholder="Price"
                                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button
                            type="button"
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                            onClick={() => setShowCreateOrderModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Create Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
);

export default ManualOrderModal;