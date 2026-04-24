import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AdminTable = ({ columns, data, onRowClick, emptyMessage = "No Data Available", pagination }) => {
    const isPaged = Boolean(pagination && typeof pagination === 'object');
    const page = isPaged ? Number(pagination.page || 1) : 1;
    const limit = isPaged ? Number(pagination.limit || data.length || 10) : data.length;
    const totalItems = isPaged ? Number(pagination.totalItems || 0) : data.length;
    const totalPages = isPaged ? Math.max(1, Number(pagination.totalPages || 1)) : 1;
    const startIndex = (page - 1) * limit;
    const showingTo = Math.min(startIndex + data.length, totalItems);

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white border-b border-gray-200">
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`py-4 px-4 text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-widest ${col.className || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.length > 0 ? (
                            data.map((row, rowIdx) => (
                                <tr
                                    key={row._id || row.id || rowIdx}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    className={`group hover:bg-gray-50/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                                >
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className={`py-4 px-4 align-top ${col.className || ''}`}>
                                            {col.render ? col.render(row) : (
                                                <span className="text-xs font-medium text-black">
                                                    {row[col.accessor]}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="py-8 text-center text-xs font-semibold text-gray-400 uppercase tracking-widest px-4">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isPaged && totalItems > 0 && (
                <div className="px-4 md:px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs md:text-sm text-gray-500">
                    <span>Showing {startIndex + 1} to {showingTo} of {totalItems} entries</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => pagination.onPageChange?.(page - 1)}
                            disabled={page <= 1}
                            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <span className="font-medium text-gray-900">Page {page} of {totalPages}</span>
                        <button
                            onClick={() => pagination.onPageChange?.(page + 1)}
                            disabled={page >= totalPages}
                            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTable;
