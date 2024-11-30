import React, { useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { SidebarHeader } from "../../components/SideBarHeader";
import { NavLink } from "react-router-dom";
import home from '../Global/icons/home.png'; 
import live from '../Global/icons/vdo.png';
import nearby from '../Global/icons/route.png';
import { useSignOut } from "../../components/context/SignOutContext";
import grid from './icons/grid.png';
import suggestions from './icons/suggestions.png';
import chat from './icons/live-chat.png';
import user from './icons/user.png';
import collection from './icons/collection.png';
import dollar from './icons/dollar.png';
import privacy from './icons/privacy.png';
import settings from './icons/settings.png';
import terms from './icons/terms.png';
import info from './icons/info.png';
import tick from './icons/tick.png';
import logout from './icons/logout.png';
import menu from '../Global/icons/menu.png';

function Sidebarr(props) {
  const [toggled, setToggled] = React.useState(false);
  const [hasImage, setHasImage] = React.useState(false);
  const [theme, setTheme] = React.useState("light");
  const [collapsed, setCollapsed] = React.useState(window.innerWidth <= 976); // Set initial collapse state based on screen size
  const { openSignOutPopup } = useSignOut();
  localStorage.setItem("collapsed", !collapsed)

  // Update collapsed state on window resize
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= 976);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const themes = {
    light: {
      sidebar: {
        backgroundColor: "#000000",
        color: "#ffffff",
      },
      menu: {
        menuContent: "#000000",
        icon: "#000000",
        hover: {
          backgroundColor: "#c493e2",
          color: "#ffffff",
        },
        disabled: {
          color: "#9fb6cf",
        },
      },
    },
    dark: {
      sidebar: {
        backgroundColor: "#0b2948",
        color: "#8ba1b7",
      },
      menu: {
        menuContent: "#082440",
        icon: "#59d0ff",
        hover: {
          backgroundColor: "#00458b",
          color: "#b6c8d9",
        },
        disabled: {
          color: "#3e5e7e",
        },
      },
    },
  };

  // hex to rgba converter
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Collapse sidebar if user navigates to any menu item on medium or smaller screens
  const handleMenuItemClick = () => {
    if (window.innerWidth < 976) {
      setCollapsed(true);
    }
  };

  return (
    <div
      style={{
        direction: "ltr",
      }}
      className="font-gotham h-[100vh] font-light items-start flex overflow-y-auto scrollable-div"
    >
      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        backgroundColor={hexToRgba(
          themes[theme].sidebar.backgroundColor,
          hasImage ? 0.9 : 1
        )}
        rootStyles={{
          color: themes[theme].sidebar.color,
        }}
        className="sidebar"
      >
        <div className="flex items-center justify-between">
          <IconButton onClick={() => { setCollapsed(!collapsed); }}>
            <img src={menu} className="h-6 ml-5" />
          </IconButton>
          <SidebarHeader />
        </div>
        <div style={{ flex: 1, marginBottom: "2px" }}>
          <Menu
            menuItemStyles={{
              button: {
                "&.active": {
                  backgroundColor: "#c4b678",
                },
                "&:hover": {
                  color: "black",
                  marginLeft: "6px",
                  marginRight: "6px",
                  borderRadius: "5px"
                },
              },
            }}
          >
            <MenuItem onClick={handleMenuItemClick} component={<NavLink to="/dashboard" end />} icon={<Box component="img" src={home} alt={home} className="h-6" />}> Home </MenuItem>
            <MenuItem onClick={handleMenuItemClick} component={<NavLink to="/dashboard/live" end />} icon={<Box component="img" src={live} alt={live} className="h-6" />}> Live </MenuItem>
            <MenuItem onClick={handleMenuItemClick} component={<NavLink to="/dashboard/nearby" end />} icon={<Box component="img" src={nearby} alt={nearby} className="h-6" />}> Nearby </MenuItem>
            <MenuItem onClick={handleMenuItemClick} component={<NavLink to="/dashboard/feeds" end />} icon={<Box component="img" src={grid} alt={grid} className="h-6" />}> Feeds </MenuItem>
            <MenuItem onClick={handleMenuItemClick} component={<NavLink to="/dashboard/suggestions" end />} icon={<Box component="img" src={suggestions} alt={suggestions} className="h-6" />}> Suggestions </MenuItem>
            <MenuItem onClick={handleMenuItemClick} component={<NavLink to="/dashboard/chats" end />} icon={<Box component="img" src={chat} alt={chat} className="h-6" />}>
              Chats <span className="bg-main-gradient text-sm rounded-full px-1.5 py-0.5 ml-2">11</span>
            </MenuItem>
            <MenuItem onClick={handleMenuItemClick} component={<NavLink to="/dashboard/subscription" end />} icon={<Box component="img" src={dollar} alt={dollar} className="h-6" />}> Subscriptions </MenuItem>
            <MenuItem onClick={handleMenuItemClick} component={<NavLink to="/dashboard/profile" end />} icon={<Box component="img" src={user} alt={user} className="h-6" />}> My Profile </MenuItem>
            <MenuItem onClick={handleMenuItemClick} component={<NavLink to="/dashboard/privacy-policy" end />} icon={<Box component="img" src={privacy} alt={privacy} className="h-6" />}> Privacy Policy </MenuItem>
            <MenuItem onClick={handleMenuItemClick} component={<NavLink to="/dashboard/terms" end />} icon={<Box component="img" src={terms} alt={terms} className="h-6" />}> Terms & Condition </MenuItem>
            <MenuItem onClick={handleMenuItemClick} component={<NavLink to="/dashboard/settings" end />} icon={<Box component="img" src={settings} alt={settings} className="h-6" />}> Settings </MenuItem>
            <MenuItem onClick={handleMenuItemClick} icon={<Box component="img" src={info} alt={info} className="h-6" />}> Help & Support </MenuItem>
            <SubMenu label="More">
              <MenuItem onClick={handleMenuItemClick} className="bg-black" component={<NavLink to="/dashboard/creator" end />} icon={<Box component="img" src={tick} alt={tick} className="h-6" />}>Become a creator</MenuItem>
            </SubMenu>
            <MenuItem onClick={() => { openSignOutPopup(); handleMenuItemClick(); }} icon={<Box component="img" src={logout} alt={logout} className="h-7" />}> Sign Out </MenuItem>
          </Menu>
        </div>
      </Sidebar>
    </div>
  );
}

export default Sidebarr;