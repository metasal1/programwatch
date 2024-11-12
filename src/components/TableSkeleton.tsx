import React from 'react';
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

const TableSkeleton = () => {
    return (
        <TableBody>
            {[...Array(10)].map((_, index) => (
                <TableRow key={`skeleton-row-${index}`}>
                    {/* Program Name */}
                    <TableCell>
                        <div className="h-4 w-32 bg-gray-8 d0 rounded animate-pulse" />
                    </TableCell>

                    {/* Version */}
                    <TableCell>
                        <div className="h-4 w-16 bg-gray-20 rounded animate-pulse" />
                    </TableCell>

                    {/* Icons Column */}
                    <TableCell>
                        <div className="flex items-center gap-2">
                            {[...Array(4)].map((_, iconIndex) => (
                                <div
                                    key={`icon-${iconIndex}`}
                                    className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"
                                />
                            ))}
                        </div>
                    </TableCell>

                    {/* Program Address */}
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
                            <div className="w-5 h-5 bg-gray-100 rounded animate-pulse" />
                        </div>
                    </TableCell>

                    {/* Derived Address */}
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
                            <div className="w-5 h-5 bg-gray-100 rounded animate-pulse" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
};

export default TableSkeleton;
