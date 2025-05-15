 import React, { useState } from 'react';
 
 // Sample data for states and cities (you can replace this with an API call or JSON file)
 const stateCityData = {
   Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
   Delhi: ['New Delhi', 'South Delhi', 'North Delhi'],
   Karnataka: ['Bangalore', 'Mysore', 'Hubli'],
   Gujarat: ['Ahmedabad', 'Surat', 'Vadodara'],
   // Add more states and cities as needed
 };
 
 const AddressForm = ({ onSubmit, onCancel }) => {
   const [formData, setFormData] = useState({
     name: '',
     phone: '',
     alternatePhone: '',
     pincode: '',
     state: '',
     city: '',
     houseNo: '',
     area: '',
     landmark: '',
     type: 'Home',
   });
   const [errors, setErrors] = useState({});
 
   // Handle input changes
   const handleChange = (e) => {
     const { name, value } = e.target;
     setFormData((prev) => ({
       ...prev,
       [name]: value,
       // Reset city when state changes
       ...(name === 'state' ? { city: '' } : {}),
     }));
     setErrors((prev) => ({ ...prev, [name]: '' }));
   };
 
   // Validate form
   const validateForm = () => {
     const newErrors = {};
     if (!formData.name.trim()) newErrors.name = 'Name is required';
     if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
     if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
     if (!formData.state) newErrors.state = 'State is required';
     if (!formData.city) newErrors.city = 'City is required';
     if (!formData.houseNo.trim()) newErrors.houseNo = 'House number is required';
     if (!formData.area.trim()) newErrors.area = 'Area is required';
     if (!formData.type) newErrors.type = 'Address type is required';
     return newErrors;
   };
 
   // Handle form submission
   const handleSubmit = (e) => {
     e.preventDefault();
     const validationErrors = validateForm();
     if (Object.keys(validationErrors).length > 0) {
       setErrors(validationErrors);
       return;
     }
     onSubmit(formData);
     // Reset form after submission
     setFormData({
       name: '',
       phone: '',
       alternatePhone: '',
       pincode: '',
       state: '',
       city: '',
       houseNo: '',
       area: '',
       landmark: '',
       type: 'Home',
     });
   };
 
   // Get list of states
   const states = Object.keys(stateCityData);
 
   // Get cities based on selected state
   const cities = formData.state ? stateCityData[formData.state] || [] : [];
 
   return (
     <div className="bg-gray-50 p-6 rounded shadow mb-4">
       <h3 className="text-lg font-bold mb-4">Add New Address</h3>
       <form onSubmit={handleSubmit} className="space-y-4">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <label className="block text-gray-700">Name</label>
             <input
               type="text"
               name="name"
               value={formData.name}
               onChange={handleChange}
               className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                 errors.name ? 'border-red-500' : ''
               }`}
             />
             {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
           </div>
           <div>
             <label className="block text-gray-700">Phone Number</label>
             <input
               type="tel"
               name="phone"
               value={formData.phone}
               onChange={handleChange}
               className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                 errors.phone ? 'border-red-500' : ''
               }`}
             />
             {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
           </div>
           <div>
             <label className="block text-gray-700">Alternate Phone (Optional)</label>
             <input
               type="tel"
               name="alternatePhone"
               value={formData.alternatePhone}
               onChange={handleChange}
               className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
           </div>
           <div>
             <label className="block text-gray-700">Pincode</label>
             <input
               type="text"
               name="pincode"
               value={formData.pincode}
               onChange={handleChange}
               className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                 errors.pincode ? 'border-red-500' : ''
               }`}
             />
             {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
           </div>
           <div>
             <label className="block text-gray-700">State</label>
             <select
               name="state"
               value={formData.state}
               onChange={handleChange}
               className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                 errors.state ? 'border-red-500' : ''
               }`}
             >
               <option value="">Select State</option>
               {states.map((state) => (
                 <option key={state} value={state}>
                   {state}
                 </option>
               ))}
             </select>
             {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
           </div>
           <div>
             <label className="block text-gray-700">City</label>
             <select
               name="city"
               value={formData.city}
               onChange={handleChange}
               className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                 errors.city ? 'border-red-500' : ''
               }`}
               disabled={!formData.state} // Disable city dropdown until a state is selected
             >
               <option value="">Select City</option>
               {cities.map((city) => (
                 <option key={city} value={city}>
                   {city}
                 </option>
               ))}
             </select>
             {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
           </div>
           <div>
             <label className="block text-gray-700">House No.</label>
             <input
               type="text"
               name="houseNo"
               value={formData.houseNo}
               onChange={handleChange}
               className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                 errors.houseNo ? 'border-red-500' : ''
               }`}
             />
             {errors.houseNo && <p className="text-red-500 text-sm">{errors.houseNo}</p>}
           </div>
           <div>
             <label className="block text-gray-700">Area/Colony</label>
             <input
               type="text"
               name="area"
               value={formData.area}
               onChange={handleChange}
               className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                 errors.area ? 'border-red-500' : ''
               }`}
             />
             {errors.area && <p className="text-red-500 text-sm">{errors.area}</p>}
           </div>
           <div>
             <label className="block text-gray-700">Landmark (Optional)</label>
             <input
               type="text"
               name="landmark"
               value={formData.landmark}
               onChange={handleChange}
               className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
           </div>
           <div>
             <label className="block text-gray-700">Address Type</label>
             <select
               name="type"
               value={formData.type}
               onChange={handleChange} // Fixed typo: handleChange instead of handleDetailChange
               className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                 errors.type ? 'border-red-500' : ''
               }`}
             >
               <option value="Home">Home</option>
               <option value="Work">Work</option>
             </select>
             {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
           </div>
         </div>
         <div className="flex justify-end space-x-4">
           <button
             type="button"
             onClick={onCancel}
             className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
           >
             Cancel
           </button>
           <button
             type="submit"
             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
           >
             Save Address
           </button>
         </div>
       </form>
     </div>
   );
 };
 
 export default AddressForm;