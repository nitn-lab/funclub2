import React, { useState, useEffect } from "react";
import LookingFor from "./LookingForData";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const LookingForForm = ({ onInputChange, onSkip, data }) => {
  const [formData, setFormData] = useState({
    looking_for: data.looking_for || [],
  });

  useEffect(() => {
    onInputChange({ looking_for: formData.looking_for });
  }, [formData, onInputChange]);

  const handleClick = (dataType) => {
    setFormData((prev) => {
      const updatedLookingFor = prev.looking_for.includes(dataType)
        ? prev.looking_for.filter((item) => item !== dataType)
        : [...prev.looking_for, dataType]; 

      return { ...prev, looking_for: updatedLookingFor };
    });
  };

  return (
    <div className="w-full py-5 text-primary-dark">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold xs:text-3xl">Looking For Details!</h1>
        <button
          className="w-max active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-1 px-2 rounded-md bg-primary-dark text-lg font-bold text-primary-light"
          onClick={onSkip}
        >
          Skip 
        </button>
      </div>
      <p className="font-medium text-lg mt-2">
        Please Choose your Looking For!!
      </p>
      <div className="mt-3 grid grid-cols-4 xs:flex xs:flex-wrap">
        {LookingFor && LookingFor.map((item, index) => (
          <div
            className="w-fit cursor-pointer m-2 xs:m-1.5"
            key={index}
            onClick={() => handleClick(item.type)}
          >
            <div className="flex border-2 border-primary-dark py-1 px-2 rounded-full items-center gap-2">
              <CheckCircleIcon
                style={{
                  display: formData.looking_for.includes(item.type) ? "block" : "none",
                }}
              />
              <h2 className="font-semibold">
                {item.type === "Care" ? (
                  <div className="flex items-center gap-x-1">
                    <img src={item.imageUrl} className="h-5 w-5" alt="care icon" />
                    <span>{item.type}</span>
                  </div>
                ) : (
                  <span>{item.type}</span>
                )}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LookingForForm;