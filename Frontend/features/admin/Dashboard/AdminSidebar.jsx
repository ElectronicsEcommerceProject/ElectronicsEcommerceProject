import React, { useState } from 'react';
import { House, Package, ShoppingCartSimple, UsersThree, Star, Ticket, BellRinging, ChartBar, Gear, UserCircleGear, Check } from 'phosphor-react';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard'); // Default active item

  const menuItems = [
    { label: 'Dashboard', icon: <House size={24} weight="bold" className="text-blue-600" /> },
    { label: 'Product Management', icon: <Package size={24} weight="bold" className="text-orange-500" /> },
    { label: 'Order Management', icon: <ShoppingCartSimple size={24} weight="bold" className="text-red-500" /> },
    { label: 'User Management', icon: <UsersThree size={24} weight="bold" className="text-green-500" /> },
    { label: 'Review Management', icon: <Star size={24} weight="bold" className="text-yellow-500" /> },
    { label: 'Coupons & Offers', icon: <Ticket size={24} weight="bold" className="text-purple-500" /> },
    { label: 'Notifications', icon: <BellRinging size={24} weight="bold" className="text-pink-500" /> },
    { label: 'Reports & Analytics', icon: <ChartBar size={24} weight="bold" className="text-teal-500" /> },
    { label: 'Site Settings', icon: <Gear size={24} weight="bold" className="text-gray-600" /> },
    { label: 'Admin Profile', icon: <UserCircleGear size={24} weight="bold" className="text-indigo-600" /> },
  ];

  return (
    <aside className="w-64 bg-white h-screen shadow-md fixed">
      <nav className="space-y-2 mt-10 px-6">
        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            isActive={activeItem === item.label}
            onClick={() => setActiveItem(item.label)}
          />
        ))}
      </nav>
    </aside>
  );
};

const MenuItem = ({ icon, label, isActive, onClick }) => (
  <div
    className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 relative ${
      isActive ? 'bg-purple-100 text-purple-600' : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
    }`}
    onClick={onClick}
  >
    {isActive && (
      <span className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r animate-slide-in" />
    )}
    <div className="flex items-center gap-2">
      {icon}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </div>
);


export default Sidebar;