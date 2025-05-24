import React from "react";

const TripTableSkeleton = () => {
  return (
    <div role="status" class="w-full animate-pulse mt-10">
      <h3 className="h-6 bg-gray-300 rounded-full w-[90%] mx-auto mb-4"></h3>
      <h3 className="h-6 bg-gray-300 rounded-full w-[90%] mx-auto mb-4"></h3>
      <h3 className="h-6 bg-gray-300 rounded-full w-[90%] mx-auto mb-4"></h3>
      <h3 className="h-6 bg-gray-300 rounded-full w-[90%] mx-auto mb-4"></h3>
      <h3 className="h-6 bg-gray-300 rounded-full w-[90%] mx-auto mb-4"></h3>
      <h3 className="h-6 bg-gray-300 rounded-full w-[90%] mx-auto mb-4"></h3>
      <h3 className="h-6 bg-gray-300 rounded-full w-[90%] mx-auto mb-4"></h3>
      <h3 className="h-6 bg-gray-300 rounded-full w-[90%] mx-auto mb-4"></h3>
      <h3 className="h-6 bg-gray-300 rounded-full w-[90%] mx-auto mb-4"></h3>
    </div>
    // <div className="animate-pulse">
    //   {/* Header */}
    //   <div className="grid grid-cols-8 bg-gray-100 p-3 rounded-t-lg">
    //     {[...Array(8)].map((_, index) => (
    //       <div key={index} className="h-6 bg-gray-300 rounded"></div>
    //     ))}
    //   </div>

    //   {/* Rows */}
    //   {[...Array(5)].map((_, rowIndex) => (
    //     <div key={rowIndex} className="grid grid-cols-8 border-b p-3">
    //       {[...Array(8)].map((_, colIndex) => (
    //         <div key={colIndex} className="h-5 bg-gray-200 rounded"></div>
    //       ))}
    //     </div>
    //   ))}
    // </div>
  );
};

export default TripTableSkeleton;
