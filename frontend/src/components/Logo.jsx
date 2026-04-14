import React from 'react';

export default function Logo({ className = "w-48" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            {/* Circle / Globe background */}
            <circle cx="65" cy="60" r="32" fill="#e9ecef" />
            
            {/* Mountain & Globe Grid intersecting */}
            <path d="M 33,60 A 32 32 0 0 0 97,60" fill="none" stroke="#e76f51" strokeWidth="2" /> {/* Custom color touch */}
            <path d="M 65,28 A 16 32 0 0 0 65,92" fill="none" stroke="#34495e" strokeWidth="2" opacity="0.5" />
            <path d="M 65,28 A 16 32 0 0 1 65,92" fill="none" stroke="#34495e" strokeWidth="2" opacity="0.5" />

            {/* Majestic Peak bg */}
            <path d="M 20,80 L 55,25 L 75,55 L 85,40 L 110,80 Z" fill="#ffffff" />
            {/* Majestic Peak outline */}
            <path d="M 20,80 L 55,25 L 75,55 L 85,40 L 110,80" fill="none" stroke="#2c3e50" strokeWidth="2.5" strokeLinejoin="round" />
            
            {/* Snow caps */}
            <path d="M 43,45 L 50,55 L 57,45 L 55,25 Z" fill="#2c3e50" />

            {/* Text */}
            <text x="135" y="75" fontFamily="'Cormorant Garamond', serif" fontWeight="600" fontSize="46" fill="#1a252f" letterSpacing="1">
                all about <tspan fontStyle="italic" fill="#7f8c8d">travel</tspan>
            </text>
        </svg>
    </div>
  );
}
