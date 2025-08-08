import React, { useState } from 'react';
import YearlyCalendarView from '../components/YearlyCalendarView';
import NavaCalendar from '../components/NavaCalendar';
import { calendarEventsData } from '../data/calendarEvents';

const ToggleButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
            isActive
                ? 'bg-brand-secondary text-white shadow-glow-sm'
                : 'bg-transparent text-text-muted hover:bg-slate-100'
        }`}
    >
        {label}
    </button>
);

const CalendarPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('yearly');

    return (
        <div className="bg-gradient-to-br from-bg-panel to-bg-panel-hover border border-slate-200 rounded-xl shadow-md h-full overflow-hidden flex flex-col">
            <header className="flex-shrink-0 flex justify-between items-center px-6 py-4 bg-white/70 backdrop-blur-sm border-b border-slate-200">
                <h1 className="text-2xl font-bold text-text-primary">Academic Calendar</h1>
                <div className="flex items-center gap-2 bg-white p-1 rounded-full shadow-inner">
                    <ToggleButton
                        label="Monthly"
                        isActive={viewMode === 'monthly'}
                        onClick={() => setViewMode('monthly')}
                    />
                    <ToggleButton
                        label="Yearly"
                        isActive={viewMode === 'yearly'}
                        onClick={() => setViewMode('yearly')}
                    />
                </div>
            </header>
            <div className="flex-grow min-h-0 bg-bg-panel">
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