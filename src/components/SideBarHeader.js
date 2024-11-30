import styled from "@emotion/styled";
import React, { useState, useEffect } from "react";
import bell from '../screens/Global/icons/bell.png';
import tick from '../screens/Global/icons/tick.png';
import crown from '../screens/Global/icons/crown.png';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import { Box } from '@mui/material';
import { FaBell } from "react-icons/fa";
import SearchModal from "../screens/SidebarComponents/Search";
import search from "../screens/Global/icons/search.png";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const StyledSidebarHeader = styled.div`
  height: 80px;
  min-height: 64px;
  display: flex;
  align-items: center;

  > div {
    width: 100%;
    overflow: hidden;
  }
`;

// const StyledLogo = styled.div`
//   width: 45px;
//   min-width: 45px;
//   height: 45px;
//   min-height: 45px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   color: white;

//   ${(props) =>
//     props.rtl
//       ? `
//       margin-left: 10px;
//       margin-right: 4px;
//       `
//       : `
//       margin-right: 10px;
//       margin-left: 4px;
//       `}
// `;

// Mock notifications
const mockNotifications = [
  {
    img: "https://gratisography.com/wp-content/uploads/2024/10/gratisography-birthday-dog-sunglasses-800x525.jpg",
    notification: "sends you a message",
    name: "Prerna",
    time: "Tuesday 9:30 pm",
    timestamp: "5 hours ago"
  },
  {
    img: "https://gratisography.com/wp-content/uploads/2024/10/gratisography-birthday-dog-sunglasses-800x525.jpg",
    notification: "started following you.",
    name: "Gunjan",
    time: "Monday 9:30 pm",
    timestamp: "10 hours ago"
  },
  {
    img: "https://gratisography.com/wp-content/uploads/2024/10/gratisography-birthday-dog-sunglasses-800x525.jpg",
    notification: "likes your post.",
    name: "Sonia",
    time: "Wednesday 2:30 pm",
    timestamp: "15 hours ago"
  },
  {
    img: "https://gratisography.com/wp-content/uploads/2024/10/gratisography-birthday-dog-sunglasses-800x525.jpg",
    notification: "shared a post.",
    name: "Mahira",
    time: "Saturday 5:30 pm",
    timestamp: "3 hours ago"
  },
  {
    img: "https://gratisography.com/wp-content/uploads/2024/10/gratisography-birthday-dog-sunglasses-800x525.jpg",
    notification: "commented on your post.",
    name: "Roshan",
    time: "Friday 9:30 pm",
    timestamp: "5 hours ago"
  },
  {
    img: "https://gratisography.com/wp-content/uploads/2024/10/gratisography-birthday-dog-sunglasses-800x525.jpg",
    notification: "liked your post.",
    name: "Sneha",
    time: "Tuesday 3 am",
    timestamp: "9 hours ago"
  },
];

export const SidebarHeader = ({ children, rtl, ...rest }) => {
  const id = localStorage.getItem('id');
  const token = localStorage.getItem('jwtToken');

  const [user, setUser] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUserData(id);
    }
  }, [user, id]);

  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/userById/${id}`, {
        headers: { Authorization: `${token}` },
      });

      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };

  return (
    <StyledSidebarHeader {...rest}>
      <div className="flex items-center justify-between mx-3 py-10 font-gotham font-light">
        {/* <div className="flex items-center gap-x-1.5">
          <img src={user.profileImage} className="h-10 w-10 rounded-full object-cover" />
          <div className="flex items-center gap-1">
            <h2 className="truncate text-lg font-light">{user.username}</h2>
            {user.role === 'creator' && <img src={tick} className="h-4" />}
            {user.role === 'vip creator' && <img src={crown} className="h-4" />}
          </div>
        </div> */}

        

        <div className="flex items-center gap-2">
          <Tooltip
            title={
              <Box className='scrollable-div pr-4 font-gotham ' sx={{ width: '300px', height: '360px', overflowY: 'auto' }}>
                <div className="flex items-center gap-2 w-full border-b-[0.1px]  border-white ">
                  <FaBell className="text-lg ml-2" />
                  <h1 className="  py-2 text-base">Notifications</h1>
                </div>
                <ul>
                  {mockNotifications.length > 0 ? mockNotifications.map((notification, index) => (
                    <div className="text-sm  border-b-[0.1px]  border-white cursor-pointer  py-4">
                      <div className="flex gap-2">
                        <img src={notification.img} alt="user image" className="bg-black rounded-full h-6 w-6" />
                        <h4 className="font-bold">{notification.name}</h4>
                        <li key={index} className="font-light">{notification.notification}</li>
                      </div>
                      <div className="flex items-center justify-between ml-8 mr-2 font-light">
                        <p>{notification.time}</p>
                        <p>{notification.timestamp}</p>
                      </div>
                    </div>
                  )) : <div className="flex items-center justify-center text-base h-40">No new notification</div>}
                </ul>
              </Box>
            }
            arrow
            placement="bottom"
            PopperProps={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, -15],
                  },
                },
              ],
            }}
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundImage: 'linear-gradient(to top right, #8b5cf6, #ec4899)',
                  // backgroundColor: 'white',
                  color: 'white',  // Tooltip text color
                  boxShadow: 8,
                  borderRadius: 3,
                },
              },

            }}
          >
            <IconButton>
              <img src={bell} className="h-5 cursor-pointer" />
            </IconButton>
          </Tooltip>
          <img
            src={search}
            onClick={() => setIsSearch(true)}
            className=" h-5 cursor-pointer"
          />
        </div>
      </div>
      <SearchModal isOpen={isSearch} onClose={() => setIsSearch(false)} />
    </StyledSidebarHeader>
  );
};