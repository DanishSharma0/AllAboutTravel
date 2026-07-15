import React from 'react';

export default function Logo({ className = "w-48" }) {
  return (
    <div className={`flex items-center justify-center group cursor-pointer ${className}`}>
        <svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            {/* Globe Background */}
            <circle cx="65" cy="60" r="32" fill="#e9ecef" className="transition-colors duration-700 group-hover:fill-[#fdfbf7]" />
            
            {/* Sunrise Arc */}
            <path 
              d="M 33,60 A 32 32 0 0 0 97,60" 
              fill="none" 
              stroke="#e76f51" 
              strokeWidth="2" 
              className="origin-[65px_60px] transition-all duration-[800ms] ease-in-out group-hover:-rotate-180 group-hover:stroke-[#f97316] group-hover:stroke-[3px] group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"
            /> 
            
            <path d="M 65,28 A 16 32 0 0 0 65,92" fill="none" stroke="#34495e" strokeWidth="2" opacity="0.5" />
            <path d="M 65,28 A 16 32 0 0 1 65,92" fill="none" stroke="#34495e" strokeWidth="2" opacity="0.5" />

            {}
            <path d="M 20,80 L 55,25 L 75,55 L 85,40 L 110,80 Z" fill="#ffffff" />
            {}
            <path d="M 20,80 L 55,25 L 75,55 L 85,40 L 110,80" fill="none" stroke="#2c3e50" strokeWidth="2.5" strokeLinejoin="round" />
            
            {}
            <path d="M 43,45 L 50,55 L 57,45 L 55,25 Z" fill="#2c3e50" />

            {/* The Text */}
            <text x="135" y="75" fontFamily="'Cormorant Garamond', serif" fontWeight="600" fontSize="46" fill="#1a252f" letterSpacing="1">
                all about <tspan fontStyle="italic" className="fill-[#7f8c8d] transition-colors duration-[800ms] ease-in-out group-hover:fill-[#f97316]">travel</tspan>
            </text>
        </svg>
    </div>
  );
}
