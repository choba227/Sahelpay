import React from 'react';

interface PhoneContainerProps {
  children: React.ReactNode;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] flex justify-center">
      {/* Clean, perfectly responsive mobile-first application container without mockup borders */}
      <main className="w-full max-w-[430px] min-h-screen bg-white flex flex-col shadow-sm sm:border-x sm:border-gray-100">
        <div className="w-full flex-1 px-5 pt-3 pb-2 flex flex-col justify-between">
          {children}
        </div>
      </main>
    </div>
  );
};
