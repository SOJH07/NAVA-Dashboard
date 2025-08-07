
import React from 'react';
import type { LiveStudent } from '../types';

interface SelectionSummaryProps {
    students: LiveStudent[];
}

const BuildingIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> );
const TechIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> );
const EnglishIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18m-18 0a9 9 0 0118 0m-18 0a9 9 0 0018 0" /></svg>;
const ChartBarIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a1 1 0 000 2h1a1 1 0 100-2H5zM5 7a1 1 0 000 2h1a1 1 0 100-2H5zM5 11a1 1 0 100 2h1a1 1 0 100-2H5zM9 4a1 1 0 10-2 0v1a1 1 0 102 0V4zM7 9a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1zM7 13a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1zM11 5a1 1 0 100-2h1a1 1 0 100 2h-1zM11 9a1 1 0 100-2h1a1 1 0 100 2h-1zM11 13a1 1 0 100-2h1a1 1 0 100 2h-1z" /></svg>);


const SummarySection: React.FC<{
    title: string;
    icon: React.ReactNode;
    items: { name: string; count: number | string }[];
}> = ({ title, icon, items }) => {
    const hasMeaningfulData = items.some(item => typeof item.count === 'number' && item.count > 0);

    if (!hasMeaningfulData) return null;

    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <h4 className="font-semibold text-text-secondary text-sm">{title}</h4>
            </div>
            <div className="pl-6 text-sm space-y-1">
                {items.map(item => {
                    if (item.count === 0) {
                        return null;
                    }
                    return (
                        <div key={item.name} className="flex justify-between items-center">
                            <span className="text-text-primary">{item.name}</span>
                            <span className="font-bold text-text-primary">{item.count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const SelectionSummary: React.FC<SelectionSummaryProps> = ({ students }) => {

    const analysis = React.useMemo(() => {
        const allCompanies = Array.from(new Set(students.map(s => s.company))).sort();
        const allTechTracks = Array.from(new Set(students.map(s => s.trackName))).sort();
        
        const companyCounts = allCompanies.map(name => ({ name, count: students.filter(s => s.company === name).length }));
        const techTrackCounts = allTechTracks.map(name => ({ name, count: students.filter(s => s.trackName === name).length }));

        const performanceCounts = [
            { name: 'Proficient (ESP-II)', count: students.filter(s => s.englishCurriculumName === 'ESP-II').length },
            { name: 'In Development (SEA)', count: students.filter(s => s.englishCurriculumName === 'SEA').length }
        ];

        return { companyCounts, techTrackCounts, performanceCounts };
    }, [students]);

    return (
        <div className="bg-bg-panel border border-slate-200 p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-baseline mb-4">
                <h3 className="text-lg font-bold text-text-primary">Selection Summary</h3>
                <span className="font-extrabold text-2xl text-brand-primary">{students.length} <span className="text-sm font-medium text-text-muted">Students</span></span>
            </div>
            
            <div className="space-y-4">
                <SummarySection title="Companies" icon={<BuildingIcon className="h-4 w-4 text-text-muted"/>} items={analysis.companyCounts} />
                <SummarySection title="Technical Tracks" icon={<TechIcon className="h-4 w-4 text-text-muted"/>} items={analysis.techTrackCounts} />
                <SummarySection title="Performance" icon={<ChartBarIcon className="h-4 w-4 text-text-muted" />} items={analysis.performanceCounts} />
            </div>
        </div>
    );
};

export default SelectionSummary;
