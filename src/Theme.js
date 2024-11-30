import React, { useEffect, useState } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const Theme = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if(theme === 'dark'){
      document.documentElement.classList.add('dark');
    }
    else
    {document.documentElement.classList.remove( 'dark');}
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button className="float-right mt-3 -mr-16 xs:-mr-0 xs:mt-1 p-2 bg-main-gradient rounded-full" onClick={toggleTheme}>
           {theme === 'light' ? <LightModeIcon className="text-yellow-300 "/> : <DarkModeIcon className=" text-white"/>}
        </button>
  );
};

export default Theme;