import React from 'react';
import { House, Package, ShoppingCartSimple, UsersThree, Star, Ticket, BellRinging, ChartBar, Gear, UserCircleGear } from 'phosphor-react';

const Sidebar = () => (
  <aside className="w-64 bg-white h-screen shadow-md">
     <nav className="space-y-4 mt-10 px-6">
      <MenuItem icon={<House size={24} weight="bold" className="text-blue-600" />} label="Dashboard" />
      <MenuItem icon={<Package size={24} weight="bold" className="text-orange-500" />} label="Product Management" />
      <MenuItem icon={<ShoppingCartSimple size={24} weight="bold" className="text-red-500" />} label="Order Management" />
      <MenuItem icon={<UsersThree size={24} weight="bold" className="text-green-500" />} label="User Management" />
      <MenuItem icon={<Star size={24} weight="bold" className="text-yellow-500" />} label="Review Management" />
      <MenuItem icon={<Ticket size={24} weight="bold" className="text-purple-500" />} label="Coupons & Offers" />
      <MenuItem icon={<BellRinging size={24} weight="bold" className="text-pink-500" />} label="Notifications" />
      <MenuItem icon={<ChartBar size={24} weight="bold" className="text-teal-500" />} label="Reports & Analytics" />
      <MenuItem icon={<Gear size={24} weight="bold" className="text-gray-600" />} label="Site Settings" />
      <MenuItem icon={<UserCircleGear size={24} weight="bold" className="text-indigo-600" />} label="Admin Profile" />
    </nav>
  </aside>
);

const MenuItem = ({ icon, label }) => (
  <div className="flex items-center gap-3 text-gray-700 hover:text-purple-600 cursor-pointer">
    {icon}
    <span>{label}</span>
  </div>
);

export default Sidebar;
