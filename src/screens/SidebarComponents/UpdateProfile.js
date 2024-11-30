import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const UpdateProfile = () => {
  const id = localStorage.getItem('id');
  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: '',
    bio:'',
    country: '',
    personality: '',
    smoking: '',
    drinking: '',
    ethnicity: '',
    sexual_orientation: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUserData(id);
    }
  }, [id]);

  const fetchUserData = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/userById/${id}`, {
        headers: { Authorization: `${token} ` },
      });
      setLoading(false);
      const fetchedUser = response.data.data;
      setUserData({
        username: fetchedUser.username,
        country: fetchedUser.country,
        bio: fetchedUser.bio,
        ethnicity: fetchedUser.ethnicity,
        smoking: fetchedUser.smoking,
        drinking: fetchedUser.drinking,
        personality: fetchedUser.personality,
        sexual_orientation: fetchedUser.sexual_orientation,
      });
    } catch (error) {
      console.error('Failed to fetch user data', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(`${BASE_URL}/api/v1/updateUsers/${id}`, userData, {
        headers: { Authorization: `${token}` },
      });
     
        toast.success('Field updated successfully!!');
        navigate('/dashboard/profile')
      setLoading(false);
    } catch (error) {
      console.error('Failed to update user data!!', error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto h-[100vh] md:h-[calc(100vh-20px)] font-gotham font-light rounded-lg md:rounded-none bg-black text-white p-8 scrollable-div overflow-y-auto md:pb-32">
      <h2 className="text-center font-medium italic text-xl underline underline-offset-4">Edit Profile</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="w-4/5 mx-auto my-12 md:my-6 sm:w-full sm:mx-3">

          <label className=" w-full">
            Username
            <input
              className="bg-gray-800 rounded-lg p-2 w-full mt-2 mb-8"
              type="text"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
            />
          </label>
          <label className="w-full my-10">
            Country
            <input
              className="bg-gray-800 rounded-lg w-full p-2 mt-2 mb-8"
              type="text"
              name="country"
              value={userData.country}
              onChange={handleInputChange}
            />
          </label>



          <label className="w-full">
            Ethnicity
            <input
              className="bg-gray-800 rounded-lg p-2 w-full mt-2 mb-8"
              type="text"
              name="ethnicity"
              value={userData.ethnicity}
              onChange={handleInputChange}
            />
          </label>
          <label className="w-full">
            Personality
            <input
              className="bg-gray-800 rounded-lg p-2 w-full mt-2 mb-8"
              type="text"
              name="personality"
              value={userData.personality}
              onChange={handleInputChange}
            />
          </label>



          <label className="w-full">
            Smoking
            <input
              className="bg-gray-800 rounded-lg p-2 w-full mt-2 mb-8"
              type="text"
              name="smoking"
              value={userData.smoking}
              onChange={handleInputChange}
            />
          </label>
          <label className="w-full my-12">
            Drinking
            <input
              className="bg-gray-800 rounded-lg w-full p-2 mt-2 mb-8"
              type="text"
              name="drinking"
              value={userData.drinking}
              onChange={handleInputChange}
            />
          </label>




          <label className="w-full">
            Sexual Orientation
            <input
              className="bg-gray-800 rounded-lg w-full p-2 mt-2 mb-8"
              type="text"
              name="sexual_orientation"
              value={userData.sexual_orientation}
              onChange={handleInputChange}
            />
          </label>
          <label className="w-full">
            Bio
            <input
              className="bg-gray-800 rounded-lg w-full p-2 mt-2 mb-8"
              type="text"
              name="bio"
              value={userData.bio}
              onChange={handleInputChange}
            />
          </label>

          <button type="submit" className="float-right bg-main-gradient hover:scale-105 p-2 rounded-lg ">Update</button>
        </form>
      )}
    </div>
  );
};

export default UpdateProfile;