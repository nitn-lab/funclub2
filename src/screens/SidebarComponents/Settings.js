import React, { useState } from 'react';
import axios from 'axios';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { toast } from 'react-toastify';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Settings = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if ( password === '' || email === '') {
        toast.error('All fields are required!');
        setLoading(false);
      }    else{
        const response = await axios.post(`${BASE_URL}/api/v1/passwordReset`, { email, password });
        console.log(response)
        setLoading(false);
          if(response.status === 201){
            toast.success("Password reset successfully!!")
          }
      }
      
    } catch (err) {
      setLoading(false);
      console.error(err)
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="w-full h-[100vh] mx-auto p-10 md:p-2 bg-black text-white font-gotham font-light">
      <h2 className="mb-5 text-2xl font-medium">Settings and activity</h2>
      <button
        className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center w-full justify-between"
        onClick={handleToggle}
      >
        Accounts Settings
        <span className={`ml-2 transition duration-300 `}>
          {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </span>
      </button>
      {isOpen && (
        <div className="mt-4">
          <div className="accordion bg-gray-800  rounded-md p-4">
            <div className="accordion-item">
              <div className="accordion-header">
                <button
                  className="accordion-button"
                  aria-expanded="true"
                  aria-controls="accordion-example"
                >
                  Reset Password
                </button>
              </div>
              <div
                id="accordion-example"
                className="accordion-collapse collapse show"
                aria-labelledby="accordion-example-heading"
                data-bs-parent="#accordion-example"
              >
                <div className="accordion-body">
                  <form onSubmit={handleResetPassword}>
                    <div className="my-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="text"
                        className="form-control m-2 w-full p-2  border-none outline-none bg-black text-white"
                        id="email"
                       
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label ">
                         Password
                      </label>
                      <input
                        type="password"
                        className="form-control w-full p-2  m-2 border-none outline-none bg-black text-white"
                        id="password"
                      
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="float-right rounded-md px-3 py-2 bg-main-gradient mt-3"
                    >
                      {loading ? <span className="loading loading-spinner loading-md"></span> : 'Reset Password'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;