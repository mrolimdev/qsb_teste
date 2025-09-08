import React from 'react';

interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "Carregando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600"></div>
      <p className="text-lg text-stone-600 font-semibold">{text}</p>
    </div>
  );
};

export default Loader;