import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="h-40 bg-gray-200 animate-pulse"></div>
      <div className="p-4">
        <div className="h-6 w-3/4 bg-gray-200 mb-2 animate-pulse"></div>
        <div className="h-4 w-1/2 bg-gray-200 animate-pulse"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
