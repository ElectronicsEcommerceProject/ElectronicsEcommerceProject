import React, { useState, useEffect } from "react";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    captcha: "",
  });
  const [captchaText, setCaptchaText] = useState("");

  const generateCaptcha = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = () => {
    if (formData.captcha !== captchaText) {
      alert("Invalid CAPTCHA!");
      generateCaptcha();
      setFormData((prev) => ({ ...prev, captcha: "" }));
      return;
    }
    console.log("Form Data:", formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-xs border-2 border-yellow-400 bg-white shadow-md">
        <div className="bg-yellow-400 text-center py-2">
          <h5 className="text-black text-base font-bold">Maa Lakshmi Login</h5>
        </div>
        <div className="border-b-4 border-blue-700" />
        <div className="p-4">
          <h6 className="text-center mb-4 text-blue-700 text-base font-bold tracking-wide">
            ADMIN LOGIN
          </h6>
          <div className="relative mb-3">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                className="bi bi-person-circle"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
              </svg>
            </span>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              value={formData.username}
              onChange={handleChange}
              className="pl-10 w-full py-1.5 border border-gray-300 rounded-none text-gray-800 font-semibold text-xs focus:outline-blue-700"
            />
          </div>
          <div className="relative mb-3">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                className="bi bi-lock-fill"
                viewBox="0 0 16 16"
              >
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
              </svg>
            </span>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 w-full py-1.5 border border-gray-300 rounded-none text-gray-800 font-semibold text-xs focus:outline-blue-700"
            />
          </div>
          <div className="relative mb-3">
            <div className="h-8 flex items-center justify-between border border-gray-300 bg-gray-200 px-2">
              <span className="text-gray-800 font-bold text-xs">Captcha</span>
              <span className="flex-1 text-center text-red-600 font-bold text-xs">{captchaText}</span>
              <button
                type="button"
                onClick={generateCaptcha}
                className="text-gray-600 hover:text-blue-700 text-base"
              >
                ⟳
              </button>
            </div>
            <input
              type="text"
              name="captcha"
              placeholder="Enter Captcha"
              value={formData.captcha}
              onChange={handleChange}
              className="pl-3 w-full py-1.5 border border-gray-300 rounded-none text-gray-800 font-bold text-xs focus:outline-blue-700 mt-2"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-1.5 text-xs rounded-none tracking-wide"
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;