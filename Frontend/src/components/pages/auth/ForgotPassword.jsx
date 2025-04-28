import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOtpSent) {
      alert(`OTP submitted: ${otp}`);
    } else {
      setIsOtpSent(true);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="form-container pro-style">
        <div className="icon-wrapper">
          <FaLock className="form-icon" />
        </div>
        <h2 className="form-title">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-input modern-input"
            placeholder={isOtpSent ? 'Enter your OTP' : 'Enter your email'}
            value={isOtpSent ? otp : email}
            onChange={(e) =>
              isOtpSent ? setOtp(e.target.value) : setEmail(e.target.value)
            }
            required
          />
          <button type="submit" className="submit-button modern-button">
            {isOtpSent ? 'Verify OTP' : 'Send OTP'}
          </button>
        </form>

        {/* Working login link */}
        <p className="text-center mt-4">
          Remember password?{' '}
          <Link to="/login" className="text-blue-500 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
