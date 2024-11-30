import React from "react";

const Sidebar = ({ steps, currentStep }) => {
  return (
    <div className="relative w-1/3 h-full rounded-l-lg overflow-hidden md:w-full md:h-16 md:rounded-lg">
      <div className="absolute inset-0 w-full h-full rounded-l-lg overflow-hidden md:rounded-lg">
        <img
          src="https://media.istockphoto.com/id/1445815190/vector/modern-gradient-colorful-heart-shape-logo-vector-design-element.jpg?s=612x612&w=0&k=20&c=NMrKHQHEefP6A8llcvmh6rmCikDlB1NRLEQUggMOVWs="
          className="absolute inset-0 w-full h-full object-cover"
          alt="Background"
        />
        <div className="absolute inset-0 backdrop-blur-xl bg-black/10">
          <ul className="text-white p-8 text-xl tracking-wide md:flex md:justify-around md:p-0">
            {steps.map((step, index) => (
              <li
                key={index}
                className={`py-2 md:py-4 ${
                  index <= currentStep ? "text-lime-500" : "text-white"
                }`}
              >
                <div className="flex items-center">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center  ${
                      index <= currentStep
                        ? "bg-lime-500 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="ml-3 md:hidden">{step.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;