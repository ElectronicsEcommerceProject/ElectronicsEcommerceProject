import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import ProfilePageService from "./ProfilePageService";
import AlertService from "../../../components/Alert/AlertService";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    postal_code: "",
    profileImage_url: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const data = await ProfilePageService.getProfileData(token);
        console.log("Fetched profile data:", data);
        setProfileData({
          name: data.name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          address: data.address || "",
          city: data.city || "",
          postal_code: data.postal_code || "",
          profileImage_url: data.profileImage_url || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
    console.log("Selected file:", file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const formData = new FormData();
      Object.keys(profileData).forEach((key) => {
        formData.append(key, profileData[key]);
      });
      if (imageFile) {
        formData.append("profileImage", imageFile); // Append the profile image
      }

      await ProfilePageService.updateProfileData(formData, token);
      AlertService.showSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("❌ Error updating profile:", err);
    }
  };

  if (loading)
    return <div className="text-center py-10">Loading profile data...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1f1f1f] text-white p-6 rounded-md mr-6">
        <div className="flex justify-center mb-4">
          {profileData.profileImage_url ? (
            <img
              src={profileData.profileImage_url}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-700"
            />
          ) : (
            <FaUserCircle className="text-7xl text-gray-400" />
          )}
        </div>
        <h4 className="text-center text-lg font-semibold mb-4">MENU</h4>
        <ul className="space-y-2 text-sm">
          <li className="pl-2 border-l-4 border-transparent hover:border-orange-500 cursor-pointer">
            Dashboard
          </li>
          <li className="pl-2 border-l-4 border-transparent hover:border-orange-500 cursor-pointer">
            Purchase History
          </li>
          <li className="pl-2 border-l-4 border-transparent hover:border-orange-500 cursor-pointer">
            Wishlist
          </li>
          <li className="pl-2 border-l-4 border-orange-500 font-semibold">
            Manage Profile
          </li>
        </ul>
      </div>

      {/* Profile Form */}
      <div className="flex-1 text-white">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Manage Profile</h2>
          <p className="text-sm text-gray-400 mt-1">
            Home &gt; Dashboard &gt;{" "}
            <span className="text-white">Manage Profile</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-[#1f1f1f] text-white mb-6">
            <Card.Header className="border-b border-gray-700 text-lg font-semibold bg-transparent">
              Basic info
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 bg-[#111] text-white border border-gray-700 rounded"
                  />
                </div>
                <div>
                  <label className="text-sm">Your Mobile</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={profileData.phone_number}
                    readOnly
                    className="w-full mt-1 px-3 py-2 bg-[#111] text-white border border-gray-700 rounded cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-sm">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    readOnly
                    className="w-full mt-1 px-3 py-2 bg-[#111] text-white border border-gray-700 rounded cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-sm">Photo</label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="w-full mt-1 bg-[#111] text-white border border-gray-700 rounded"
                  />
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="bg-[#1f1f1f] text-white">
            <Card.Header className="border-b border-gray-700 text-lg font-semibold bg-transparent">
              Shipping info
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm">Address</label>
                  <textarea
                    rows="2"
                    name="address"
                    placeholder="Your Address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 bg-[#111] text-white border border-gray-700 rounded"
                  ></textarea>
                </div>
                <div>
                  <label className="text-sm">City</label>
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 bg-[#111] text-white border border-gray-700 rounded"
                  />
                </div>
                <div>
                  <label className="text-sm">Postal Code</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={profileData.postal_code}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 bg-[#111] text-white border border-gray-700 rounded"
                  />
                </div>
              </div>
            </Card.Body>
          </Card>

          <div className="mt-6 text-right">
            <Button
              type="submit"
              className="bg-orange-600 border-none hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded"
            >
              Update Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
