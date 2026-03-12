import React from 'react';

const AdminStatsCard = ({ label, value, icon: Icon, color, bgColor, badge, badgeColor }) => {
    return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex items-center justify-between h-full">
            <div className="text-left">
                <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{value}</h3>
                {badge && (
                    <div className="mt-2">
                        <span className={`text-[8px] md:text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100 ${badgeColor || 'text-gray-400'} uppercase tracking-tight`}>
                            {badge}
                        </span>
                    </div>
                )}
            </div>
            <div className={`w-10 h-10 md:w-12 md:h-12 ${bgColor || 'bg-gray-50'} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shrink-0 ml-4`}>
                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${color}`} strokeWidth={2.5} />
            </div>
        </div>
    );
};

export default AdminStatsCard;
