import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown"; 

const AdvanceForm = ({ onInputChange, data }) => {
  const [formData, setFormData] = useState({
    ethnicity:data.ethnicity || "",
    country :data.country || "",
    exercise:data.exercise || "",
    drinking:data.drinking || "",
    smoking:data.smoking || "",
    sexual_orientation:data.sexual_orientation || ""
  });

 
  useEffect(() => {
    onInputChange(formData);
  }, [formData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDropdownChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className="w-full py-5 text-primary-light">
      <h1 className="text-4xl font-bold text-primary-dark xs:text-3xl">Advance Details!</h1>
      <p className="font-medium text-lg text-primary-dark mt-2 ">
        Please fill your Advance Details!
      </p>
      <div className="mt-3  flex gap-8 xs:gap-4">
        <div className="w-1/2">
          <label className="text-base font-medium text-primary-dark">Ethnicity</label>
          <input
            name="ethnicity"
            required
            className="w-full border-2 rounded-lg p-2 mt-1 focus:outline-violet-500 focus:ring-violet-500 placeholder-black bg-white"
            placeholder="Enter Ethnicity"
            value={formData.ethnicity}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-1/2">
          <Dropdown
            label="Country"
            options={[
             
              "United States",
              "Canada",
              "Mexico",
              "United Kingdom",
              "Australia",
              "Korea",
              "India",
              "France",
              "Italy",
              "China",
              "Russia",
              "Japan",
              "Germany",
              "Belgium",
              "Netherlands",
              "Switzerland",
              "Other",
            ]}
            onChange={(selectedOption) => handleDropdownChange('country', selectedOption)}
            value={data.country}
          />
        </div>
      </div>
      <div className="mt-3 flex gap-8 xs:gap-4">
        <div className="w-1/2">
          <Dropdown
            label="Drinking"
            options={[
             
              "Not for me",
              "Sober",
              "Sober curious",
              "On special occasions",
              "Socially on weekends",
              "Most nights",
            ]}
            onChange={(selectedOption) => handleDropdownChange('drinking', selectedOption)}
            value={data.drinking}
          />
        </div>
        <div className="w-1/2">
          <Dropdown
            label="Smoking"
            options={[
            
              "Social smoker",
              "Smoker when drinking",
              "Non-smoker",
              "Smoker",
              "Trying to quit",
            ]}
            onChange={(selectedOption) => handleDropdownChange('smoking', selectedOption)}
            value={data.smoking}
          />
        </div>
      </div>
      <div className="mt-3 flex gap-8 xs:gap-4">
      <div className="w-1/2">
          <Dropdown
            label="Exercise"
            options={["Everyday", "Often", "Sometimes", "Never"]}
            onChange={(selectedOption) => handleDropdownChange('exercise', selectedOption)}
            value={data.exercise}
          />
        </div>
        <div className="w-1/2">
          <Dropdown
            label="Sexual Orientation"
            options={[
             
              "Straight",
              "Gay",
              "Lesbian",
              "Bisexual",
              "Asexual",
              "Demisexual",
              "Pansexual",
              "Queer",
              "Bicurious",
              "Aromantic",
            ]}
            onChange={(selectedOption) => handleDropdownChange('sexual_orientation', selectedOption)}
            value={data.sexual_orientation}
          />
        </div>
        
      </div>
    </div>
  );
};

export default AdvanceForm;