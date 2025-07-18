import React from 'react';

function Spinner({ className = '' }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
}

export default Spinner; 