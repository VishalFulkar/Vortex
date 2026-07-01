import React from 'react';

const StatsCard = ({ title, value, subtext, percentage, color = '#d2ff72' }) => {
    const radius = 24;
    const stroke = 4;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

    return (
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex justify-between items-center select-none">
            <div className="flex flex-col justify-between h-full gap-2">
                <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">{title}</span>
                <div className="flex flex-col">
                    <span className="text-lg font-extrabold text-black leading-tight">
                        {value}
                    </span>
                    <span className="text-xs text-gray-400 font-semibold mt-0.5">
                        {subtext}
                    </span>
                </div>
            </div>
            <div className="relative flex items-center justify-center">
                <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                    <circle
                        stroke="#e5e7eb"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <circle
                        stroke={color}
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                </svg>
                <span className="absolute text-xs font-bold text-black select-none">
                    {Math.round(percentage)}%
                </span>
            </div>
        </div>
    );
};

export default StatsCard;
