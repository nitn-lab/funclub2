import React from "react";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <div className="flex flex-col gap-2">
      404 error - Not Found
      <Link to="/">Home</Link>
    </div>
  );
};

export default NotFound;
