import React, { useState } from 'react';
import { CheckCircle, PlusCircle } from 'lucide-react';

const CheckoutPage = () => {
  const [completedSteps, setCompletedSteps] = useState({
    login: false,
    address: false,
    order: false,
    payment: false
  });

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [activeStep, setActiveStep] = useState('login');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Rohit Kumar",
      type: "WORK",
      phone: "8084350824",
      address: "121, Tulsinagar, Balangir, Odisha - 767001"
    }
  ]);

  const user = {
    name: "Sunil Kumar",
    phone: "+9162026750526"
  };

  const paymentOptions = [
    { id: 1, type: "UPI", name: "UPI Payment", description: "Pay using any UPI app" },
    { id: 2, type: "COD", name: "Cash on Delivery", description: "Pay when you receive the product" }
  ];

  // Price details object for the right-side summary
  const priceDetails = {
    price: 61999, // Original price
    discount: 5000, // Discount amount
    total: 56999, // Price after discount
    savings: 5000
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setCompletedSteps(prev => ({ ...prev, login: true }));
    setActiveStep('address');
  };

  const handleAddressSelect = (index) => {
    setSelectedAddress(index);
  };

  const confirmAddress = () => {
    if (selectedAddress !== null) {
      setCompletedSteps(prev => ({ ...prev, address: true }));
      setActiveStep('order');
    }
  };

  const addNewAddress = () => {
    const newAddress = {
      id: addresses.length + 1,
      name: "New User",
      type: "HOME",
      phone: "1234567890",
      address: "New Address, City, State - 000000"
    };
    setAddresses([...addresses, newAddress]);
  };

  const confirmOrder = () => {
    setCompletedSteps(prev => ({ ...prev, order: true }));
    setActiveStep('payment');
  };

  const handlePaymentSelect = (index) => {
    setSelectedPayment(index);
  };

  const confirmPayment = () => {
    if (selectedPayment !== null) {
      if (paymentOptions[selectedPayment].type === 'UPI' && !upiId) {
        alert('Please enter your UPI ID to proceed.');
        return;
      }
      setCompletedSteps(prev => ({ ...prev, payment: true }));
      setShowSuccessPopup(true);

      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 2000); // Auto close popup after 2s
    }
  };

  const changeStep = (step) => setActiveStep(step);

  const isStepAccessible = (step) => {
    const steps = ['login', 'address', 'order', 'payment'];
    const idx = steps.indexOf(step);
    if (idx === 0) return true;
    return completedSteps[steps[idx - 1]];
  };

  const Tick = () => <CheckCircle className="text-green-600 w-5 h-5 inline ml-2" />;

  const OrderSuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-xs w-full">
        <CheckCircle className="text-green-600 w-12 h-12 mx-auto mb-2" />
        <h2 className="text-lg font-semibold">Order Placed Successfully!</h2>
        <p className="text-sm text-gray-600 mt-1">Thank you for shopping with us.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex">
      {/* Left Side - Checkout Steps */}
      <div className="w-full md:w-2/3 md:pr-4">
        {/* LOGIN STEP */}
        <div className={`bg-white p-4 mb-4 rounded shadow ${activeStep === 'login' ? 'border-l-4 border-blue-500' : ''}`}>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg">1. LOGIN {completedSteps.login && <Tick />}</h2>
            {completedSteps.login && <button onClick={() => changeStep('login')} className="text-sm text-blue-600">CHANGE</button>}
          </div>
          {activeStep === 'login' && !completedSteps.login && (
            <form onSubmit={handleLogin} className="mt-4 space-y-3">
              <input type="text" placeholder="Username" value={loginData.username} onChange={e => setLoginData({ ...loginData, username: e.target.value })} className="border p-2 w-full rounded" required />
              <input type="password" placeholder="Password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} className="border p-2 w-full rounded" required />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
            </form>
          )}
          {completedSteps.login && (
            <div className="mt-2 text-gray-700">{user.name} - {user.phone}</div>
          )}
        </div>

        {/* ADDRESS STEP */}
        <div className={`bg-white p-4 mb-4 rounded shadow ${activeStep === 'address' ? 'border-l-4 border-blue-500' : ''} ${!isStepAccessible('address') ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg">2. DELIVERY ADDRESS {completedSteps.address && <Tick />}</h2>
            {completedSteps.address && <button onClick={() => changeStep('address')} className="text-sm text-blue-600">CHANGE</button>}
          </div>
          {activeStep === 'address' && (
            <div className="mt-4">
              <button
                onClick={addNewAddress}
                className="flex items-center text-blue-600 mb-4 hover:text-blue-800"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Add New Address
              </button>
              {addresses.map((addr, i) => (
                <div key={addr.id} className="border p-3 rounded mb-2">
                  <label className="flex items-start">
                    <input type="radio" name="address" checked={selectedAddress === i} onChange={() => handleAddressSelect(i)} className="mt-1" />
                    <div className="ml-3">
                      <p className="font-semibold">{addr.name} ({addr.type}) - {addr.phone}</p>
                      <p className="text-sm text-gray-600">{addr.address}</p>
                    </div>
                  </label>
                  {selectedAddress === i && (
                    <button onClick={confirmAddress} className="mt-2 bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600">DELIVER HERE</button>
                  )}
                </div>
              ))}
            </div>
          )}
          {completedSteps.address && selectedAddress !== null && (
            <div className="mt-2 text-gray-700">
              <p>{addresses[selectedAddress].name} - {addresses[selectedAddress].phone}</p>
              <p className="text-sm">{addresses[selectedAddress].address}</p>
            </div>
          )}
        </div>

        {/* ORDER SUMMARY */}
        <div className={`bg-white p-4 mb-4 rounded shadow ${activeStep === 'order' ? 'border-l-4 border-blue-500' : ''} ${!isStepAccessible('order') ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg">3. ORDER SUMMARY {completedSteps.order && <Tick />}</h2>
            {completedSteps.order && <button onClick={() => changeStep('order')} className="text-sm text-blue-600">CHANGE</button>}
          </div>
          {activeStep === 'order' && (
            <div className="mt-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded"></div>
                <div>
                  <p className="font-semibold">OnePlus 10 Pro 5G</p>
                  <p className="text-sm text-gray-600">Seller: RetailNet</p>
                  <p><span className="font-bold text-lg">₹56,999</span> <span className="line-through text-sm ml-2 text-gray-500">₹61,999</span> <span className="text-green-600 text-sm ml-2">8% OFF</span></p>
                </div>
              </div>
              <button onClick={confirmOrder} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">CONFIRM ORDER</button>
            </div>
          )}
          {completedSteps.order && (
            <p className="mt-2 text-gray-700">1x OnePlus 10 Pro 5G - ₹56,999</p>
          )}
        </div>

        {/* PAYMENT STEP */}
        <div className={`bg-white p-4 mb-4 rounded shadow ${activeStep === 'payment' ? 'border-l-4 border-blue-500' : ''} ${!isStepAccessible('payment') ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg">4. PAYMENT {completedSteps.payment && <Tick />}</h2>
          </div>
          {activeStep === 'payment' && (
            <div className="mt-4 space-y-4">
              {paymentOptions.map((option, i) => (
                <label key={option.id} className="flex items-start border p-3 rounded">
                  <input type="radio" name="payment" checked={selectedPayment === i} onChange={() => handlePaymentSelect(i)} className="mt-1" />
                  <div className="ml-3">
                    <p className="font-semibold">{option.name}</p>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </label>
              ))}
              {selectedPayment !== null && paymentOptions[selectedPayment].type === 'UPI' && (
                <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="Enter your UPI ID" className="border p-2 w-full rounded" required />
              )}
              {selectedPayment !== null && (
                <button onClick={confirmPayment} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">PLACE ORDER</button>
              )}
            </div>
          )}
        </div>

        {showSuccessPopup && <OrderSuccessModal />}
      </div>

      {/* Right Side - Price Summary */}
      {!completedSteps.payment && (
        <div className="hidden md:block w-1/3 p-4">
          <div className="bg-white p-6 rounded-lg shadow sticky top-4">
            <h2 className="text-lg font-bold mb-4">PRICE DETAILS</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Price (1 item)</span>
                <span>₹{priceDetails.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-600">-₹{priceDetails.discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t pt-3 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span>₹{priceDetails.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <p className="text-green-600 text-sm mt-4">
              You will save ₹{priceDetails.savings.toLocaleString()} on this order
            </p>
            <div className="mt-6 text-sm text-gray-600">
              <p>Safe and Secure Payments. Easy returns.</p>
              <p className="mt-2">100% Authentic products</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;