import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { toast } from 'react-toastify';
import Dropdown from './MultiStepForms/Dropdown';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignUp = ({ data, onInputChange, signupInfo }) => {
  const { username, email, birthdate, password, confirm_password, gender } = data;
  const [selectedDate, setSelectedDate] = useState(birthdate ? new Date(birthdate.split('/').reverse().join('/')) : null);
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onInputChange({ ...data, [name]: value });
  };

  const handleDateChange = (e) => {
    const date = e.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date > today) {
      toast.error('Please choose a valid birthdate.');
    } else {
      const formattedDate = new Date(date).toLocaleDateString('en-US');
      onInputChange({ ...data, birthdate: formattedDate });
      setSelectedDate(date);
    }
  };

  const handleDropdownChange = (selectedValue) => {
    onInputChange({ ...data, gender: selectedValue });
  };

  const handleConfirmPasswordBlur = () => {
  
    if (confirm_password && confirm_password !== password) {
      toast.error('Passwords do not match!');
    }
  }; 

  return (
    <div className="w-full py-5 text-primary-light">
      <h1 className="text-4xl font-bold text-primary-dark xs:text-3xl">Create Account!</h1>
      <p className="font-medium text-lg text-primary-dark mt-2">Create your Free Account!</p>
      
      <div className="flex mt-3 gap-8 xs:gap-4">
        <div className="w-1/2">
          <input
            className="w-full border-2 rounded-lg p-2 mt-1 focus:outline-violet-500 focus:ring-violet-500 text-black bg-white"
            placeholder="Username"
            required
            type="text"
            name="username"
            value={username || signupInfo.name || ""}
            onChange={handleChange}
          />
        </div>
        <div className="w-1/2">
          <input
            className="w-full border-2 rounded-lg p-2 mt-1 focus:outline-violet-500 focus:ring-violet-500 placeholder-black bg-white"
            placeholder="Email"
            type="email"
            name="email"
            value={email || signupInfo.email || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex mt-3 gap-8 xs:gap-4">
        <div className="w-1/2">
          <Calendar
            className="w-full border-2 rounded-lg p-2 mt-1 focus:outline-violet-500 focus:ring-violet-500 placeholder-black bg-white"
            placeholder="Birthdate"
            onChange={handleDateChange}
            value={selectedDate}
            maxDate={new Date()} 
            showIcon
            dateFormat="dd/mm/yy"
            inputStyle={{ backgroundColor: "white", border: "none", outline: "none", color: "black" }}
            panelStyle={{ backgroundColor: "white", padding: "6px" }}
          />
        </div>
        <div className="w-1/2">
          <Dropdown
            options={[
              "Male", "Female", "Transgender", "Prefer not to say"
            ]}
            value={gender || ''}
            onChange={handleDropdownChange}
          />
        </div>
      </div>

      <div className="flex mt-3 gap-8 xs:gap-4 relative xs:block">
        <div className="w-1/2 relative xs:w-full">
          <input
            className="w-full border-2 rounded-lg p-2 mt-1 focus:outline-violet-500 focus:ring-violet-500 placeholder-black bg-white"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={password || ''}
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute right-3 top-4 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)} 
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="w-1/2 relative xs:w-full">
          <input
            className="w-full border-2 rounded-lg p-2 mt-1 focus:outline-violet-500 focus:ring-violet-500 placeholder-black bg-white"
            placeholder="Confirm Password"
            type={showConfirmPassword ? "text" : "password"} 
            name="confirm_password"
            value={confirm_password || ''}
            onChange={handleChange}
            onBlur={handleConfirmPasswordBlur}
          />
          <button
            type="button"
            className="absolute right-3 top-4 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}  
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;