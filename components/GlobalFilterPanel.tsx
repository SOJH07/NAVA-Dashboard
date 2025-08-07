
import React from 'react';
import type { LiveOpsFilters } from '../types';

interface FilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    filters: LiveOpsFilters;
    setFilters: React.Dispatch<React.SetStateAction<LiveOpsFilters>>;
    toggleArrayFilter: (filterType: 'companies' | 'techTracks' | 'englishCurriculums' | 'techGroups' | 'englishGroups' | 'classrooms' | 'aptisCEFRLevels', value: string) => void;
    clearFilters: () => void;
    allFilterOptions: {
        allCompanies: string[];
        allTechTracks: string[];
        allEnglishCurriculums: string[];
        allTechGroups: string[];
        allEnglishGroups: string[];
        allClassrooms: string[];
        allAptisCEFRLevels: string[];
    };
}

const FilterPill: React.FC<{ label: string; onClick: () => void; isActive: boolean; className?: string;}> = ({ label, onClick, isActive, className = '' }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 text-sm rounded-lg transition-all border ${
            isActive
                ? 'bg-brand-primary border-brand-primary text-white font-semibold shadow-sm'
                : 'bg-white border-slate-300 text-text-secondary hover:bg-bg-panel-hover hover:border-slate-400'
        } ${className}`}
    >
        {label}
    </button>
);

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-4 border-b border-slate-200">
        <h4 className="font-semibold text-text-secondary mb-3 px-4">{title}</h4>
        <div className="px-4">
            {children}
        </div>
    </div>
);


const GlobalFilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose, filters, setFilters, toggleArrayFilter, clearFilters, allFilterOptions }) => {
    const { allCompanies, allTechTracks, allEnglishCurriculums, allTechGroups, allEnglishGroups, allClassrooms, allAptisCEFRLevels } = allFilterOptions;
    
    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            <aside 
                className={`fixed top-0 right-0 h-full bg-bg-panel w-full max-w-sm z-50 shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-text-primary">Filters</h3>
                    <div className="flex items-center gap-4">
                         <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-700 font-semibold transition-colors">Clear All</button>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </header>
                <div className="flex-grow overflow-y-auto">
                    <FilterSection title="General">
                         <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span className="font-medium text-text-secondary text-sm w-24">Company:</span>
                            <div className="flex flex-wrap gap-2">
                                {allCompanies.map(c => <FilterPill key={c} label={c} isActive={filters.companies.includes(c)} onClick={() => toggleArrayFilter('companies', c)} />)}
                            </div>
                        </div>
                    </FilterSection>

                    <FilterSection title="Academic Tracks">
                         <div className="space-y-3">
                             <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span className="font-medium text-text-secondary text-sm w-24">Tech Track:</span>
                                 <div className="flex flex-wrap gap-2">
                                    {allTechTracks.map(t => <FilterPill key={t} label={t} isActive={filters.techTracks.includes(t)} onClick={() => toggleArrayFilter('techTracks', t)} />)}
                                </div>
                            </div>
                             <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span className="font-medium text-text-secondary text-sm w-24">English:</span>
                                 <div className="flex flex-wrap gap-2">
                                    {allEnglishCurriculums.map(c => <FilterPill key={c} label={c} isActive={filters.englishCurriculums.includes(c)} onClick={() => toggleArrayFilter('englishCurriculums', c)} />)}
                                </div>
                            </div>
                         </div>
                    </FilterSection>
                    
                    <FilterSection title="English Performance">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span className="font-medium text-text-secondary text-sm w-24">CEFR Level:</span>
                            <div className="flex flex-wrap gap-2">
                                {allAptisCEFRLevels.map(level => <FilterPill key={level} label={level} isActive={filters.aptisCEFRLevels.includes(level)} onClick={() => toggleArrayFilter('aptisCEFRLevels', level)} />)}
                            </div>
                        </div>
                    </FilterSection>

                    <FilterSection title="Live Operations">
                         <div className="space-y-3">
                             <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span className="font-medium text-text-secondary text-sm w-24">Status:</span>
                                <div className="flex flex-wrap gap-2">
                                    <FilterPill label="All" isActive={filters.status === 'all'} onClick={() => setFilters(f => ({...f, status: 'all'}))} />
                                    <FilterPill label="Live" isActive={filters.status === 'live'} onClick={() => setFilters(f => ({...f, status: 'live'}))} />
                                    <FilterPill label="Not Live" isActive={filters.status === 'not-live'} onClick={() => setFilters(f => ({...f, status: 'not-live'}))} />
                                </div>
                            </div>
                             <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span className="font-medium text-text-secondary text-sm w-24">Session:</span>
                                <div className="flex flex-wrap gap-2">
                                    <FilterPill label="All" isActive={filters.sessionType === 'all'} onClick={() => setFilters(f => ({...f, sessionType: 'all'}))} />
                                    <FilterPill label="Tech" isActive={filters.sessionType === 'tech'} onClick={() => setFilters(f => ({...f, sessionType: 'tech'}))} />
                                    <FilterPill label="English" isActive={filters.sessionType === 'english'} onClick={() => setFilters(f => ({...f, sessionType: 'english'}))} />
                                </div>
                            </div>
                         </div>
                    </FilterSection>

                    <details className="py-4 border-b border-slate-200">
                        <summary className="font-semibold text-text-secondary cursor-pointer hover:text-text-primary transition-colors px-4">Filter by Individual Group</summary>
                        <div className="pt-4 space-y-4">
                             <div className="px-4">
                                <h4 className="font-medium text-text-secondary text-sm mb-2">Technical Groups</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {allTechGroups.map(g => <FilterPill key={g} label={g} isActive={filters.techGroups.includes(g)} onClick={() => toggleArrayFilter('techGroups', g)} />)}
                                </div>
                            </div>
                             <div className="px-4">
                                <h4 className="font-medium text-text-secondary text-sm mb-2">English Groups</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {allEnglishGroups.map(g => <FilterPill key={g} label={g} isActive={filters.englishGroups.includes(g)} onClick={() => toggleArrayFilter('englishGroups', g)} />)}
                                </div>
                            </div>
                            <div className="px-4">
                                <h4 className="font-medium text-text-secondary text-sm mb-2">Classrooms</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {allClassrooms.map(c => <FilterPill key={c} label={c} isActive={filters.classrooms.includes(c)} onClick={() => toggleArrayFilter('classrooms', c)} />)}
                                </div>
                            </div>
                        </div>
                    </details>
                </div>
            </aside>
        </>
    );
};

export default GlobalFilterPanel;
