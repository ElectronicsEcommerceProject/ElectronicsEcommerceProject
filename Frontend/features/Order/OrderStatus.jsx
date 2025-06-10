import React, { useState, useEffect } from 'react';

// Placeholder API fetch function (to be replaced with real backend call)
const fetchOrderData = async () => {
  // Simulate API response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        overallStatus: 'delivered',
        statusMessage: 'Delivery between 08:00 AM - 07:55 PM on JUN 17',
        additionalMessage: 'Your Order has been placed.',
        timeline: [
          { status: 'orderConfirmed', completed: true, date: 'Today', label: 'Order Confirmed' },
          { status: 'orderPlaced', completed: true, date: 'Mon 9th Jun', label: 'Your Order has been placed' },
          { status: 'shipped', completed: true, date: 'Jun 13', label: 'Shipped, Expected by' },
          { status: 'outForDelivery', completed: true, label: 'Out for Delivery' },
          { status: 'delivery', completed: true, date: 'Jun 17 (08:00 AM - 07:55 PM)', label: 'Delivery' },
        ],
      });
    }, 1000);
  });
};

// Main React Component
const OrderStatus = () => {
  // State for order data, loading, and error
  const [orderStatus, setOrderStatus] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isCancelPopupVisible, setIsCancelPopupVisible] = useState(false);
  const [tickedStatuses, setTickedStatuses] = useState(['orderConfirmed']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order data on mount
  useEffect(() => {
    const loadOrderData = async () => {
      try {
        setLoading(true);
        const data = await fetchOrderData(); // Replace with real API call, e.g., fetch('/api/order')
        setOrderStatus(data);
        setTickedStatuses(['orderConfirmed', 'orderPlaced']); // Default ticked statuses
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch order data');
        setLoading(false);
        console.error(err);
      }
    };
    loadOrderData();
  }, []);

  // Handle status click
  const handleStatusClick = (index) => {
    if (orderStatus?.overallStatus === 'cancelled') {
      console.log('Cannot change status: Order is cancelled.');
      return;
    }
    const newTickedStatuses = orderStatus.timeline
      .slice(0, index + 1)
      .map((item) => item.status);
    setTickedStatuses(newTickedStatuses);
  };

  // Handlers
  const handlePayment = () => {
    console.log('Payment initiated for ₹1908');
  };

  const showPopup = () => {
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const showCancelPopup = () => {
    setIsCancelPopupVisible(true);
  };

  const closeCancelPopup = () => {
    setIsCancelPopupVisible(false);
  };

  const confirmCancel = () => {
    setOrderStatus({
      ...orderStatus,
      overallStatus: 'cancelled',
      statusMessage: 'Cancelled on JUN 09',
      additionalMessage: 'Your order has been cancelled.',
    });
    setTickedStatuses([]);
    setIsCancelPopupVisible(false);
    console.log('Order cancelled successfully');
  };

  const viewSeller = () => {
    console.log('Viewing seller: yoursuitcase');
  };

  const seeUpdates = () => {
    console.log('Fetching all updates...');
  };

  const changeAddress = () => {
    console.log('Changing shipping address...');
  };

  const knowMore = () => {
    console.log('Fetching coupon details...');
  };

  // Loading and error states
  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="font-sans p-3 sm:p-5 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between max-w-6xl mx-auto gap-4 sm:gap-0">
        <div className="w-full sm:w-3/5 bg-white rounded-lg shadow-md p-4 sm:p-5">
          <button
            className="bg-yellow-400 text-gray-800 py-2 px-5 rounded text-base hover:bg-yellow-500 transition-colors"
            onClick={handlePayment}
          >
            PAY ₹1908
          </button>
          <div className="p-4 sm:p-5 my-5 flex items-center hover:scale-[1.02] transition-transform">
            <img
              src="https://via.placeholder.com/80"
              alt="Product Image"
              className="w-16 h-16 sm:w-20 sm:h-20 mr-3 sm:mr-5 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={showPopup}
            />
            <div>
              <h4
                className="m-0 text-sm sm:text-base text-gray-800 cursor-pointer hover:text-blue-500 hover:underline hover:scale-[1.02] transition-all"
                onClick={showPopup}
              >
                JACY LONIDON Hard Sided PC 8 Wheel Spinners, with Telescopic Steel Trolley and Number Lock Cabin Suitcase 8 Wheels - 21 inch
              </h4>
              <p className="my-1 text-xs sm:text-sm text-gray-600">BLUE</p>
              <p
                className="my-1 text-xs sm:text-sm text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
                onClick={viewSeller}
              >
                Seller: yoursuitcase
              </p>
              <p className="my-1 text-xs sm:text-sm font-bold text-gray-800">
                ₹1,908 <span className="text-green-500">1 offer</span>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 my-5"></div>
          <div className="my-5">
            <p
              className={`text-xs sm:text-sm font-bold flex items-center ${
                orderStatus.overallStatus === 'delivered' ? 'text-green-500' : 'text-red-600'
              }`}
            >
              <span
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full mr-1 sm:mr-1.5 ${
                  orderStatus.overallStatus === 'delivered' ? 'bg-green-500' : 'bg-red-600'
                }`}
              ></span>
              {orderStatus.statusMessage}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">{orderStatus.additionalMessage}</p>
          </div>
          <div className="relative pl-6">
            {orderStatus.timeline.map((item, index) => (
              <div
                key={item.status}
                className={`flex items-center mb-3 relative ${
                  tickedStatuses.includes(item.status) ? 'completed' : ''
                } ${orderStatus.overallStatus === 'cancelled' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                onClick={() =>
                  orderStatus.overallStatus !== 'cancelled' ? handleStatusClick(index) : null
                }
              >
                <span
                  className={`flex items-center justify-center w-4 h-4 rounded-full border-2 ${
                    tickedStatuses.includes(item.status)
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300 bg-transparent'
                  } relative z-10`}
                >
                  {tickedStatuses.includes(item.status) && (
                    <span className="text-white text-[10px]">✔</span>
                  )}
                </span>
                <p
                  className={`m-0 ml-2 text-xs sm:text-sm font-bold ${
                    orderStatus.overallStatus === 'cancelled' ? 'text-red-600' : 'text-gray-800'
                  }`}
                >
                  {item.label}{item.date ? `, ${item.date}` : ''}
                </p>
                {index < orderStatus.timeline.length - 1 && (
                  <div
                    className={`absolute left-[7px] top-[18px] h-[12px] w-[2px] ${
                      tickedStatuses.includes(item.status) ||
                      tickedStatuses.includes(orderStatus.timeline[index - 1]?.status)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    } z-0`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 my-5"></div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-2 sm:mt-2.5">
            <button
              className="bg-white text-red-600 border border-red-600 py-1.5 px-4 sm:py-2 sm:px-5 rounded text-xs sm:text-sm hover:bg-red-600 hover:text-white transition-colors mb-2 sm:mb-0"
              onClick={showCancelPopup}
            >
              Cancel
            </button>
            <a
              href="#"
              className="text-blue-500 text-xs sm:text-sm hover:text-blue-700 transition-colors no-underline"
              onClick={seeUpdates}
            >
              SEE ALL UPDATES
            </a>
          </div>
        </div>
        <div className="w-full sm:w-1/3 flex flex-col gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 w-full">
            <h4 className="m-0 text-base text-gray-800 border-b border-gray-200 pb-2">Shipping Details</h4>
            <p className="my-2 text-xs sm:text-sm text-gray-600">
              <strong>Rohit Kumar</strong>
            </p>
            <p className="my-2 text-xs sm:text-sm text-gray-600">
              12/ABC Electric Bill Collection Point, Shrikrishna Nagar, Near - Advance patna central Hospital Patna Bihar - 800020
            </p>
            <p className="my-2 text-xs sm:text-sm text-gray-600">Phone number: 6202670526</p>
            <button
              className="text-blue-500 border border-blue-500 py-1 px-2.5 rounded text-xs sm:text-sm hover:bg-blue-500 hover:text-white transition-colors"
              onClick={changeAddress}
            >
              Change
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 w-full">
            <h4 className="m-0 text-base text-gray-800 border-b border-gray-200 pb-2">Price Details</h4>
            <p className="my-2 text-xs sm:text-sm text-gray-600">
              List price <span className="float-right">₹1,999</span>
            </p>
            <p className="my-2 text-xs sm:text-sm text-gray-600">
              Selling price <span className="float-right">₹1,999</span>
            </p>
            <p className="my-2 text-xs sm:text-sm text-gray-600">
              Extra Discount <span className="float-right">-₹1,944</span>
            </p>
            <p className="my-2 text-xs sm:text-sm text-gray-600">
              Special Price <span className="float-right">₹1,955</span>
            </p>
            <p className="my-2 text-xs sm:text-sm text-gray-600">
              Delivery Charge <span className="float-right">₹40 Free</span>
            </p>
            <p className="my-2 text-xs sm:text-sm text-gray-600">
              Handling Fee <span className="float-right">₹10</span>
            </p>
            <p className="my-2 text-xs sm:text-sm text-gray-600">
              Get extra ₹60 off on 1 items (price inclusive of cashback/coupon) <span className="float-right text-green-500">-₹60</span>
            </p>
            <p className="my-2 text-xs sm:text-sm text-gray-600">
              Platform fee <span className="float-right">₹3</span>
            </p>
            <hr className="my-2" />
            <p className="my-2 text-xs sm:text-sm text-gray-800 font-bold">
              Total Amount <span className="float-right">₹1,908</span>
            </p>
            <p className="my-2 text-xs sm:text-sm text-green-500">
              1 coupon: Get extra ₹60 off on 1 items (price inclusive of cashback/coupon) <span className="float-right">-₹60</span>{' '}
              <span
                className="text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
                onClick={knowMore}
              >
                Know more
              </span>
            </p>
            <p className="my-2 text-xs sm:text-sm text-gray-600">
              Cash On Delivery: <span className="float-right">₹1908.0</span>
            </p>
          </div>
        </div>
      </div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[999] ${
          isPopupVisible || isCancelPopupVisible ? 'block' : 'hidden'
        }`}
      ></div>
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 sm:p-5 rounded-lg shadow-2xl z-[1000] text-center w-11/12 sm:w-96 ${
          isPopupVisible ? 'block' : 'hidden'
        }`}
      >
        <button
          className="absolute top-2 right-2 bg-red-600 text-white border-none rounded-full w-6 h-6 cursor-pointer hover:bg-red-700 transition-colors text-sm"
          onClick={closePopup}
        >
          X
        </button>
        <img
          src="https://via.placeholder.com/150"
          alt="Product Image"
          className="w-32 h-32 block mx-auto mb-4"
        />
        <h4 className="m-0 mb-2 text-lg font-bold text-gray-800">
          JACY LONIDON Hard Sided PC 8 Wheel Spinners
        </h4>
        <p className="my-1 text-sm text-gray-600">Color: BLUE</p>
        <p className="my-1 text-sm text-gray-600">Price: ₹1,908</p>
        <p className="my-1 text-sm text-gray-600">Seller: yoursuitcase</p>
      </div>
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 sm:p-5 rounded-lg shadow-2xl z-[1000] text-center w-11/12 sm:w-96 ${
          isCancelPopupVisible ? 'block' : 'hidden'
        }`}
      >
        <button
          className="absolute top-2 right-2 bg-red-600 text-white border-none rounded-full w-6 h-6 cursor-pointer hover:bg-red-700 transition-colors text-sm"
          onClick={closeCancelPopup}
        >
          X
        </button>
        <h4 className="m-0 mb-2 text-lg font-bold text-gray-800">Cancel Order</h4>
        <p className="my-1 text-sm text-gray-600">Are you sure you want to cancel this order?</p>
        <button
          className="bg-red-600 text-white border-none py-2 px-5 rounded-full text-sm cursor-pointer hover:bg-red-700 transition-colors mt-2"
          onClick={confirmCancel}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default OrderStatus;