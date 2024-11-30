import React from 'react';

const Pagination = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center mt-4">
      <span className="w-max text-lg font-medium  dark:text-primary-dark text-primary-light absolute bottom-0">{`${currentStep + 1} / ${totalSteps}`}</span>
    </div>
  );
};

export default Pagination;