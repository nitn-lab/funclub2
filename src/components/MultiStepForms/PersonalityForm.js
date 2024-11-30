import React, { useState, useEffect } from 'react';
import PersonalityTypes from "./PersonalityTypes";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PersonalityForm = ({ onInputChange, data }) => {
 
  const defaultType = PersonalityTypes.find(type => type.type === "INTJ");
 
  const [formData, setFormData] = useState({
    personality: data.personality || defaultType.type,  
  });

  const [hoverIndex, setHoverIndex] = useState(null)

  useEffect(() => {
   
    onInputChange({ personality: formData.personality });
  }, [formData]);

  const handleClick = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      personality: PersonalityTypes[index].type, 
    }));
  };

  const getHoverBoxPosition = (index) => {
    const totalCols = 4;
    const rowIndex = Math.floor(index / totalCols);
    const totalRows = Math.ceil(PersonalityTypes.length / totalCols);

    const isInLastTwoRows = rowIndex >= totalRows - 2;
    if (isInLastTwoRows) {
      return "bottom-full mb-0"; 
    } else {
      return "top-full mt-0"; 
    }
  };

  const getHorizontalPosition = (index) => {
    const colIndex = index % 4;
    if (colIndex < 2) {
      return "left-0 ml-0";
    } else {
      return "right-0 mr-0";
    }
  };

  return (
    <div className="w-full py-5 text-primary-dark relative">
      <h1 className="text-4xl font-bold xs:text-3xl">Personality Type!</h1>
      <p className="font-medium text-lg text-primary-dark mt-2">
        Please fill your Personality Type Details!
      </p>
      <div >
        
        {/* Main container with flex layout */}
        <div className="flex justify-start items-center w-full md:w-full h-64 md:h-44 overflow-auto xs:pt-10">
          <div className="grid grid-cols-4 gap-1 xs:flex xs:flex-wrap xs:mt-3 xs:pt-5">
            {PersonalityTypes &&
              PersonalityTypes.map((item, index) => (
                <div
                  className="relative w-fit cursor-pointer m-1.5"
                  key={index}
                  onClick={() => handleClick(index)}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)} 
                >
                  <div className={`flex border-2 py-1 px-2 rounded-full items-center gap-2
                    ${formData.personality === item.type ? 'border-primary-dark' : 'border-gray-400'}`}>
                    <CheckCircleIcon
                      style={{
                        display: formData.personality === item.type ? "block" : "none"
                      }}
                    />
                    <h2 className={`text-primary-dark font-semibold`}>
                      {item.type}
                    </h2>
                  </div>
                  
                  {/* Display the hover box near the hovered item */}
                  {hoverIndex === index && (
                    <div
                      className={`absolute ${getHoverBoxPosition(index)} ${getHorizontalPosition(index)} w-60 bg-main-gradient text-white p-2 rounded-md shadow-lg z-10`}
                    >
                      <p className="text-base">{item.description}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Display the description box next to the selected personality type */}
          {PersonalityTypes.find(item => item.type === formData.personality) && (
            <div
              className="ml-5 flex-1 bg-main-gradient h-fit text-primary-dark p-4 rounded-lg shadow-2xl z-20 xs:hidden"
              style={{ boxShadow: "0 4px 20px purple" }} 
            >
              <p className="text-lg">
                {PersonalityTypes.find(item => item.type === formData.personality).description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalityForm;