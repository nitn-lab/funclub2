import React, { useState, useEffect, useRef } from "react";
import interests from "./Interests";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const InterestForm = ({ onInputChange, data }) => {
  const [formData, setFormData] = useState({
    interest_details: data.interest_details || [],
  });
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollContainerRef = useRef(null);

 
  useEffect(() => {
    onInputChange({ interest_details: formData.interest_details });
  }, [formData, onInputChange]);

 
  const handleClick = (interest) => {
    setFormData((prev) => {
      const newinterest_details = prev.interest_details.includes(interest)
        ? prev.interest_details.filter((item) => item !== interest) 
        : [...prev.interest_details, interest]; 
      return { ...prev, interest_details: newinterest_details };
    });
  };


  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
      setIsAtBottom(true);
    }
  };

 
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setIsAtBottom(false);
    }
  };

  return (
    <div className="w-full py-5 md:py-3 text-primary-dark relative">
      <h1 className="text-4xl font-bold xs:text-3xl">Interest Details!</h1>
      <p className="font-medium text-lg mt-2">
        Please Choose your interests!!
      </p>
      <div
        className="scrollable-div md:h-[calc(100vh-50vh)] h-[calc(100vh-42vh)] mt-1 flex flex-wrap overflow-auto"
        ref={scrollContainerRef}
      >
        {interests &&
          interests.map((interest, index) => (
            <div
              className="w-fit cursor-pointer m-2 xs:m-1.5"
              key={index}
              onClick={() => handleClick(interest)}
            >
              <div className="flex border-2 border-primary-dark py-1 px-2 rounded-full items-center gap-2">
                <CheckCircleIcon
                  style={{
                    display: formData.interest_details.includes(interest) ? "block" : "none",
                  }}
                />
                <h2 className="font-semibold">{interest.type}</h2>
              </div>
            </div>
          ))}
      </div>

      {/* Arrow for scrolling to bottom */}
      {!isAtBottom && (
        <div
          className="absolute bottom-0 xs:bottom-2 bg-primary-dark right-0 p-1 cursor-pointer animate-bounce rounded-full"
          onClick={scrollToBottom}
        >
          <ArrowDownwardIcon className="text-primary-light" fontSize="medium" />
        </div>
      )}

      {/* Arrow for scrolling to top */}
      {isAtBottom && (
        <div
          className="absolute bottom-0 xs:bottom-2 bg-primary-dark animate-bounce rounded-full right-0 cursor-pointer p-1"
          onClick={scrollToTop}
        >
          <ArrowUpwardIcon className="text-primary-light" fontSize="medium" />
        </div>
      )}
    </div>
  );
};

export default InterestForm;