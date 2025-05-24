import React from "react";

const ChartsSkeleton = () => {
  return (
    <div role="status" className="w-full animate-pulse mt-10">
      <div className="grid grid-cols-1 justify-center items-center md:grid-cols-2 gap-6 md:gap-12 lg:app-24">
        <h3 className="size-72 bg-gray-300 rounded-4xl w-[90%] mx-auto mb-4"></h3>
        <h3 className="size-72 bg-gray-300 rounded-4xl w-[90%] mx-auto mb-4"></h3>
        <h3 className="size-72 bg-gray-300 rounded-4xl w-[90%] mx-auto mb-4"></h3>
        <h3 className="size-72 bg-gray-300 rounded-4xl w-[90%] mx-auto mb-4"></h3>
      </div>
    </div>
  );
};

export default ChartsSkeleton;
