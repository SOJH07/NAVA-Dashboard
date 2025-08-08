import React, { useState } from 'react';
import YearlyCalendarView from '../components/YearlyCalendarView';
import NavaCalendar from '../components/NavaCalendar';
import { calendarEventsData } from '../data/calendarEvents';

const ToggleButton: React.FC<{
    label: string;
    icon: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
            isActive
                ? 'bg-brand-secondary text-white shadow-glow-sm'
                : 'bg-transparent text-text-muted hover:bg-slate-100'
        }`}
    >
        <span className="text-base">{icon}</span>
        {label}
    </button>
);

const CalendarPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('yearly');

    return (
        <div className="relative bg-gradient-to-br from-bg-panel to-bg-panel-hover border border-slate-200 rounded-xl shadow-md h-full overflow-hidden flex flex-col">
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background:
                        'radial-gradient(at top left, rgba(129,140,248,0.15), transparent 60%), radial-gradient(at bottom right, rgba(34,211,238,0.15), transparent 60%)',
                }}
            />
            <header className="flex-shrink-0 flex justify-between items-center px-6 py-4 bg-white/70 backdrop-blur-sm border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Academic Calendar</h1>
                    <p className="text-sm text-text-secondary">Plan ahead with NAVA</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1 rounded-full shadow-inner">
                    <ToggleButton
                        label="Monthly"
                        icon="🗓️"
                        isActive={viewMode === 'monthly'}
                        onClick={() => setViewMode('monthly')}
                    />
                    <ToggleButton
                        label="Yearly"
                        icon="📆"
                        isActive={viewMode === 'yearly'}
                        onClick={() => setViewMode('yearly')}
                    />
                </div>
            </header>
            <div className="flex-grow min-h-0 bg-bg-panel relative">
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                        viewMode === 'yearly' ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <YearlyCalendarView events={calendarEventsData} />
                </div>
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                        viewMode === 'monthly' ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <NavaCalendar events={calendarEventsData} />
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;