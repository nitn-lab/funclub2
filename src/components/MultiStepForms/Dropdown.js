import React, { useState, useEffect, useRef, useMemo } from 'react';

const Dropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    onChange(option); 
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  
  const visibleOptionsCount = Math.min(options.length, 3);
  const optionHeight = 40; 
  const dropdownHeight = visibleOptionsCount * optionHeight;

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      <label className="text-base font-medium text-primary-dark">{label}</label>
      <div>
        <button
          type="button"
          className="inline-flex justify-between w-full rounded-lg border-2 xs:border-0 p-2 mt-1 focus:outline-violet-500 focus:ring-violet-500 text-black bg-white"
          onClick={handleToggle}
        >
          {value || options[0]}
          <svg
            className={`w-5 h-5 ml-2 -mr-1 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06-.02l3.22 3.1 3.22-3.1a.75.75 0 111.04 1.08l-3.75 3.6a.75.75 0 01-1.04 0l-3.75-3.6a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
        {isOpen && (
          <div 
            className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20"
            style={{ maxHeight: dropdownHeight, overflowY: 'auto' }}
          >
            <div className="py-1 ">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={`block px-4 py-1.5 xs:py-1 text-lg xs:text-sm font-semibold xs:font-normal w-full text-left hover:bg-[#d2bfe5] focus:bg-gray-100 ${option === value ? 'bg-[#ac64d8]' : 'text-black'}`}
                  style={{ height: optionHeight }}
                >
                  { option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;