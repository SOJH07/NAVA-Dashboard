import React from 'react';

interface HeaderProps {
    pageTitle: string;
    onFilterButtonClick: () => void;
    activeFilterCount: number;
    globalSearchTerm: string;
    onSearchChange: (term: string) => void;
}

const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;


const Header: React.FC<HeaderProps> = ({ pageTitle, onFilterButtonClick, activeFilterCount, globalSearchTerm, onSearchChange }) => {
    return (
        <header className="px-6 pt-6 pb-4 bg-bg-body z-10 flex justify-between items-center gap-4">
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">{pageTitle}</h1>
            <div className="flex items-center gap-3">
                 <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <SearchIcon />
                    </span>
                    <input 
                        type="search"
                        placeholder="Search Students (Name, ID, Group)..."
                        value={globalSearchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="bg-white border border-slate-300 rounded-lg py-2 px-4 pl-10 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary w-full md:w-80 shadow-sm"
                    />
                </div>
                <button
                    onClick={onFilterButtonClick}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm text-text-primary font-semibold hover:bg-slate-100 transition-colors"
                >
                    <FilterIcon />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="bg-brand-primary text-black text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;