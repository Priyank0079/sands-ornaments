import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const DataTable = ({
    columns,
    data,
    searchTerm,
    setSearchTerm,
    searchPlaceholder = "Search...",
    filters,
    children,
    itemsPerPage = 10
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="space-y-3 md:space-y-4 animate-in fade-in duration-500">
            {/* Toolbar */}
            <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 md:gap-4 items-center">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to page 1 on search
                        }}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#8D6E63]/20 focus:border-[#8D6E63] transition-all text-gray-900 placeholder-gray-500"
                    />
                </div>
                {filters && (
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                        {filters.map((filter, index) => (
                            <div key={index} className="relative shrink-0">
                                <select
                                    onChange={(e) => {
                                        filter.onChange(e.target.value);
                                        setCurrentPage(1); // Reset to page 1 on filter change
                                    }}
                                    className="bg-gray-50 border border-gray-200 rounded-lg pl-3 md:pl-4 pr-8 md:pr-10 py-1.5 md:py-2 text-[10px] md:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8D6E63]/20 appearance-none cursor-pointer"
                                >
                                    {filter.options.map((opt, i) => (
                                        <option key={i} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-500 pointer-events-none" />
                            </div>
                        ))}
                    </div>
                )}
                {children}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                {columns.map((col, index) => (
                                    <th key={index} className={`px-4 md:px-6 py-4 text-gray-800 font-bold uppercase tracking-widest text-[10px] md:text-xs ${col.align === 'right' ? 'text-right' : ''}`}>
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-900">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item, rowIndex) => (
                                    <tr key={startIndex + rowIndex} className="hover:bg-gray-50/50 transition-colors">
                                        {columns.map((col, colIndex) => (
                                            <td key={colIndex} className={`px-4 md:px-6 py-2 md:py-2.5 ${col.align === 'right' ? 'text-right' : ''}`}>
                                                {col.render ? col.render(item) : item[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-600 font-medium text-xs">
                                        No results found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {data.length > 0 && (
                    <div className="px-4 md:px-6 py-3 border-t border-gray-200 flex items-center justify-between text-xs md:text-sm text-gray-500">
                        <span>Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, data.length)} of {data.length} entries</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                            <span className="font-medium text-gray-900">Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataTable;
