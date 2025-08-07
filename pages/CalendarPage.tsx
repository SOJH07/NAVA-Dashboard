import React, { useState } from 'react';
import YearlyCalendarView from '../components/YearlyCalendarView';
import NavaCalendar from '../components/NavaCalendar';
import { calendarEventsData } from '../data/calendarEvents';

const ToggleButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
            isActive
                ? 'bg-brand-secondary text-white shadow'
                : 'bg-white text-text-muted hover:bg-slate-100'
        }`}
    >
        {label}
    </button>
);

const CalendarPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('yearly');

    return (
        <div className="bg-bg-panel border border-slate-200 rounded-lg shadow-sm h-full overflow-hidden flex flex-col">
            <header className="flex-shrink-0 flex justify-end items-center p-3 gap-4 border-b border-slate-200">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                    <ToggleButton label="Monthly" isActive={viewMode === 'monthly'} onClick={() => setViewMode('monthly')} />
                    <ToggleButton label="Yearly" isActive={viewMode === 'yearly'} onClick={() => setViewMode('yearly')} />
                </div>
            </header>
            <div className="flex-grow min-h-0">
                {viewMode === 'yearly' ? (
                     <YearlyCalendarView events={calendarEventsData} />
                ) : (
                    <NavaCalendar events={calendarEventsData} />
                )}
            </div>
        </div>
    );
};

export default CalendarPage;