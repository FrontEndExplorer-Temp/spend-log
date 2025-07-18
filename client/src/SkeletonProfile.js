import React from 'react';

function SkeletonProfile() {
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-8 mt-12 animate-pulse">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-2" />
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="mb-8">
        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div>
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded mt-6" />
    </div>
  );
}

export default SkeletonProfile; 