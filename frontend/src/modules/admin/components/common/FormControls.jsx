import React from 'react';

export const Input = ({ label, ...props }) => (
    <div className="space-y-1.5">
        {label && (
            <label className="block text-xs font-semibold text-gray-700 tracking-wide">
                {label}
            </label>
        )}
        <input
            {...props}
            className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#3E2723] focus:ring-2 focus:ring-[#3E2723]/10 transition-all shadow-sm"
        />
    </div>
);

export const Select = ({ label, options, ...props }) => (
    <div className="space-y-1.5">
        {label && (
            <label className="block text-xs font-semibold text-gray-700 tracking-wide">
                {label}
            </label>
        )}
        <div className="relative">
            <select
                {...props}
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-3.5 text-sm text-gray-900 focus:outline-none focus:border-[#3E2723] focus:ring-2 focus:ring-[#3E2723]/10 transition-all shadow-sm appearance-none cursor-pointer"
            >
                {options.map((opt, i) => (
                    <option key={i} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </div>
        </div>
    </div>
);

export const TextArea = ({ label, ...props }) => (
    <div className="space-y-1.5">
        {label && (
            <label className="block text-xs font-semibold text-gray-700 tracking-wide">
                {label}
            </label>
        )}
        <textarea
            {...props}
            rows={props.rows || 4}
            className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#3E2723] focus:ring-2 focus:ring-[#3E2723]/10 transition-all shadow-sm resize-none"
        ></textarea>
    </div>
);

export const FormSection = ({ title, children, className = "" }) => (
    <div className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm ${className}`}>
        {title && (
            <h3 className="text-sm font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
                {title}
            </h3>
        )}
        <div className="space-y-5">
            {children}
        </div>
    </div>
);
