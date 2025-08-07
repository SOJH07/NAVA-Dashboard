import React, { useState, useMemo } from 'react';
import type { CalendarEvent } from '../types';
import GridView from './GridView';
import YearNavigator from './YearNavigator';

interface NavaCalendarProps {
    events: CalendarEvent[];
}

const LEGEND_ITEMS = [
    { type: 'CH', label: 'Cohort', color: 'bg-blue-500' },
    { type: 'NAVA', label: 'NAVA Holiday', color: 'bg-yellow-400' },
    { type: 'National', label: 'National Holiday', color: 'bg-purple-500' },
    { type: 'Ramadan', label: 'Ramadan', color: 'border-green-400 border-2 bg-white' },
    { type: 'Eid', label: 'Eid', color: 'bg-sky-400' },
    { type: 'Annual', label: 'Annual Vacation', color: 'bg-orange-500' },
];

const Legend: React.FC<{ activeFilters: Set<string>, onToggle: (type: string) => void }> = ({ activeFilters, onToggle }) => {
    const allTypes = useMemo(() => LEGEND_ITEMS.map(i => i.type), []);
    
    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {LEGEND_ITEMS.map(item => (
                <button 
                    key={item.type}
                    onClick={() => onToggle(item.type)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 border
                        ${activeFilters.has(item.type) || activeFilters.size === 0 ? 'bg-white border-slate-300 text-text-secondary' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-70'}
                        hover:border-slate-400 hover:opacity-100
                    `}
                >
                    <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                    {item.label}
                </button>
            ))}
        </div>
    );
};

const NavaCalendar: React.FC<NavaCalendarProps> = ({ events }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

    const handleToggleFilter = (eventType: string) => {
        setActiveFilters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(eventType)) {
                newSet.delete(eventType);
            } else {
                newSet.add(eventType);
            }
            return newSet;
        });
    };

    const filteredEvents = useMemo(() => {
        if (activeFilters.size === 0) return events;
        return events.filter(e => activeFilters.has(e.type));
    }, [events, activeFilters]);

    return (
        <div className="flex h-full">
            <YearNavigator 
                events={events}
                currentDate={currentDate}
                onDateSelect={setCurrentDate}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <header className="flex-shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center p-4 gap-4 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-text-primary">NAVA Operational Calendar</h2>
                    <Legend activeFilters={activeFilters} onToggle={handleToggleFilter} />
                </header>
                <main className="flex-grow p-4 min-h-0 bg-slate-50">
                    <GridView 
                        events={filteredEvents} 
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                    />
                </main>
            </div>
        </div>
    );
};

export default NavaCalendar;