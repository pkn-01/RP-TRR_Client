import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-md ${className}`}
    >
      {children}
    </div>
  );
}
