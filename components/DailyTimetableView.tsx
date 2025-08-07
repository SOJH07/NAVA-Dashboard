import React from 'react';
import type { Assignment, DailyPeriod, GroupInfo } from '../types';

interface DailyTimetableViewProps {
    periods: DailyPeriod[];
    assignments: Assignment[];
    selectedDay: string;
    isLiveDay: boolean;
    currentPeriod: DailyPeriod | null;
    groupInfo: GroupInfo;
    focusedInstructor: string | null;
}

const TableHeader: React.FC<{isTech?: boolean}> = ({ isTech = false }) => (
    <thead className="text-xs text-slate-500 font-semibold uppercase">
        <tr>
            <th className="p-2 text-left w-1/2">{isTech ? 'Trainer' : 'Teachers'}</th>
            <th className="p-2 text-left">Group</th>
            <th className="p-2 text-left">Class</th>
            <th className="p-2 text-left">Track</th>
        </tr>
    </thead>
);

const TableRow: React.FC<{assignment: Assignment, groupInfo: GroupInfo, hasFocus: boolean, isTech?: boolean}> = ({ assignment, groupInfo, hasFocus, isTech = false }) => {
    const instructorColor = isTech ? 'text-status-tech' : 'text-status-english';
    const trackName = isTech ? assignment.topic : groupInfo[assignment.group]?.curriculum_name;

    return (
        <tr className={`transition-opacity duration-300 ${!hasFocus ? 'opacity-30' : ''}`}>
            <td className={`p-2 font-bold ${instructorColor}`}>{assignment.instructors.join(', ')}</td>
            <td className="p-2 font-semibold text-text-primary">{assignment.group}</td>
            <td className="p-2 text-text-secondary">{assignment.classroom}</td>
            <td className="p-2 text-text-secondary">{trackName}</td>
        </tr>
    )
};


const DailyTimetableView: React.FC<DailyTimetableViewProps> = ({ periods, assignments, selectedDay, isLiveDay, currentPeriod, groupInfo, focusedInstructor }) => {

    const classPeriods = periods.filter(p => p.type === 'class');

    return (
        <div className="bg-bg-panel border border-slate-200 rounded-lg shadow-sm h-full flex flex-col overflow-auto">
            {/* Main Header */}
            <div className="sticky top-0 bg-white z-20 grid grid-cols-[10rem_1fr_1fr] border-b-2 border-slate-200">
                <div className="p-4 bg-slate-50 border-r border-slate-200 flex items-center justify-center">
                    <h2 className="text-2xl font-bold text-text-primary">{selectedDay}</h2>
                </div>
                 <div className="p-4 bg-status-english-light text-center">
                    <h3 className="text-xl font-bold text-status-english">English</h3>
                </div>
                 <div className="p-4 bg-status-tech-light text-center border-l border-slate-200">
                    <h3 className="text-xl font-bold text-status-tech">Tech</h3>
                </div>
            </div>

            {/* Content */}
            <div className="flex-grow">
                 {classPeriods.map(period => {
                    const englishAssignments = assignments.filter(a => a.period === period.name && a.type === 'English').sort((a, b) => a.group.localeCompare(b.group));
                    const techAssignments = assignments.filter(a => a.period === period.name && a.type === 'Technical').sort((a, b) => a.group.localeCompare(b.group));
                    
                    if (englishAssignments.length === 0 && techAssignments.length === 0) {
                        return null;
                    }

                    const isLive = isLiveDay && currentPeriod?.name === period.name;

                    return (
                        <div key={period.name} className={`grid grid-cols-[10rem_1fr_1fr] border-b border-slate-200 transition-colors duration-300 ${isLive ? 'bg-amber-100' : ''}`}>
                            {/* Period Cell */}
                            <div className={`p-4 border-r border-slate-200 flex items-center justify-center ${isLive ? 'bg-amber-200' : 'bg-slate-50'}`}>
                                <div className="text-center">
                                    <p className={`font-extrabold text-xl ${isLive ? 'text-amber-800 animate-pulse' : 'text-text-primary'}`}>{period.name}</p>
                                    <p className={`text-xs font-semibold ${isLive ? 'text-amber-700' : 'text-text-muted'}`}>{period.start} - {period.end}</p>
                                </div>
                            </div>

                            {/* English Panel */}
                            <div className="p-2">
                                {englishAssignments.length > 0 && (
                                    <table className="w-full text-sm">
                                        <TableHeader />
                                        <tbody>
                                            {englishAssignments.map(a => (
                                                <TableRow 
                                                    key={a.id} 
                                                    assignment={a} 
                                                    groupInfo={groupInfo}
                                                    hasFocus={!focusedInstructor || a.instructors.includes(focusedInstructor)}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* Tech Panel */}
                            <div className="p-2 border-l border-slate-200">
                                {techAssignments.length > 0 && (
                                     <table className="w-full text-sm">
                                        <TableHeader isTech />
                                        <tbody>
                                            {techAssignments.map(a => (
                                                <TableRow 
                                                    key={a.id} 
                                                    assignment={a} 
                                                    groupInfo={groupInfo}
                                                    hasFocus={!focusedInstructor || a.instructors.includes(focusedInstructor)}
                                                    isTech
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )
                 })}
                 {assignments.length === 0 && (
                    <div className="text-center p-20 text-slate-500">
                        <h3 className="text-lg font-semibold">No assignments for {selectedDay}.</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyTimetableView;