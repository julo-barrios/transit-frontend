import type { ReactNode } from "react";
import { Search } from "lucide-react";

interface TableToolbarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
    children?: ReactNode; // For additional filters
}

const TableToolbar = ({
    searchTerm,
    onSearchChange,
    placeholder = "Buscar...",
    children,
}: TableToolbarProps) => {
    return (
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-base-200/30 p-4 rounded-xl border border-base-200">
            {/* Search Input */}
            <div className="relative w-full lg:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input
                    type="text"
                    placeholder={placeholder}
                    className="input input-bordered w-full pl-10 focus:border-primary"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Filters Area */}
            {children && (
                <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
                    {children}
                </div>
            )}
        </div>
    );
};

export default TableToolbar;
