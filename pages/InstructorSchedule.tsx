import React, { useState, useEffect, useMemo } from 'react';
import useScheduleStore from '../hooks/useScheduleStore';
import type { Assignment, DailyPeriod, LiveOpsFilters, GroupInfo, EnhancedStudent } from '../types';
import { allInstructors } from '../data/scheduleData';
import DailyTimetableView from '../components/DailyTimetableView';
import WeeklyScheduleView from '../components/WeeklyScheduleView';
import DailyScheduleView from '../components/DailyScheduleView';
import TeachingLoad from '../components/TeachingLoad';

const DAYS: Assignment['day'][] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

type ViewMode = 'weekly' | 'daily' | 'table' | 'load';
type Density = 'comfortable' | 'compact';

const Tooltip: React.FC<{ content: React.ReactNode, position: { x: number, y: number } | null }> = ({ content, position }) => {
    if (!position) return null;
    return (
        <div 
            className="fixed z-50 bg-gray-800 text-white p-2 text-sm rounded-lg shadow-xl transition-opacity duration-200 pointer-events-none"
            style={{ top: position.y + 15, left: position.x + 15 }}
        >
            {content}
        </div>
    );
};

const WeekButton: React.FC<{ label: string, type: 'odd' | 'even', activeType: 'odd' | 'even', isLive: boolean, onClick: (type: 'odd' | 'even') => void }> = ({ label, type, activeType, isLive, onClick }) => (
    <button onClick={() => onClick(type)} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors relative ${activeType === type ? 'bg-white shadow text-brand-primary' : 'text-text-muted hover:bg-slate-200'}`}>
        {label}
        {isLive && <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" title="Live Week"></span>}
    </button>
);


interface InstructorSchedulePageProps {
    filters: LiveOpsFilters;
    groupInfo: GroupInfo;
    groupCompanyMap: Record<string, string[]>;
    activeFilterCount: number;
    dailySchedule: DailyPeriod[];
    isEvenWeek: boolean;
    currentPeriod: DailyPeriod | null;
    now: Date;
    globalSearchTerm: string;
    allStudents: EnhancedStudent[];
}

const InstructorSchedulePage: React.FC<InstructorSchedulePageProps> = (props) => {
    const { filters, groupInfo, groupCompanyMap, activeFilterCount, dailySchedule, isEvenWeek, currentPeriod, now, globalSearchTerm, allStudents } = props;
    
    const { weekType, setWeekType, getAssignmentsForWeek } = useScheduleStore();
    const [viewMode, setViewMode] = useState<ViewMode>('weekly');
    const [density, setDensity] = useState<Density>('comfortable');
    const [selectedDay, setSelectedDay] = useState<Assignment['day']>(DAYS[now.getDay()] ?? 'Sunday');
    const [focusedInstructor, setFocusedInstructor] = useState<string | null>(null);
    const [tooltipState, setTooltipState] = useState<{ content: React.ReactNode, position: {x: number, y: number} } | null>(null);

    // Set the initial week type based on the live week status
    useEffect(() => {
        setWeekType(isEvenWeek ? 'even' : 'odd');
    }, [isEvenWeek, setWeekType]);

    const assignmentsForWeek = useMemo(() => getAssignmentsForWeek(), [weekType, getAssignmentsForWeek]);
    
    const liveDay = useMemo(() => DAYS[now.getDay()] ?? null, [now]);

    const filteredAssignments = useMemo(() => {
        let assignments = assignmentsForWeek;

        if (focusedInstructor) {
            assignments = assignments.filter(a => a.instructors.includes(focusedInstructor));
        }
        
        const hasCompanyFilter = filters.companies.length > 0;
        if(hasCompanyFilter){
            assignments = assignments.filter(a => {
                const companiesInGroup = groupCompanyMap[a.group] || [];
                return filters.companies.some(c => companiesInGroup.includes(c));
            });
        }
        
        const hasTechTrackFilter = filters.techTracks.length > 0;
        if(hasTechTrackFilter){
            assignments = assignments.filter(a => {
                if (a.type === 'English') return true; // Don't filter out english classes
                const track = groupInfo[a.group]?.track_name;
                return track && filters.techTracks.includes(track);
            });
        }
        
        const hasEnglishCurriculumFilter = filters.englishCurriculums.length > 0;
        if (hasEnglishCurriculumFilter) {
            assignments = assignments.filter(a => {
                if (a.type === 'Technical') return true; // Don't filter out tech classes
                const curriculum = groupInfo[a.group]?.curriculum_name;
                return curriculum && filters.englishCurriculums.includes(curriculum);
            });
        }

        if (filters.techGroups.length > 0) {
            assignments = assignments.filter(a => filters.techGroups.includes(a.group));
        }

        if (filters.englishGroups.length > 0) {
            assignments = assignments.filter(a => filters.englishGroups.includes(a.group));
        }

        if (filters.classrooms.length > 0) {
            assignments = assignments.filter(a => filters.classrooms.some(c => `C-${a.classroom.replace('.', '')}` === c));
        }
        
        if (globalSearchTerm) {
            const lowercasedFilter = globalSearchTerm.toLowerCase();
            const matchingStudents = allStudents.filter(student =>
              student.fullName.toLowerCase().includes(lowercasedFilter) ||
              String(student.navaId).includes(lowercasedFilter)
            );
            const studentGroups = new Set(matchingStudents.flatMap(s => [s.techGroup, s.englishGroup]));
            if (studentGroups.size > 0) {
                 assignments = assignments.filter(a => studentGroups.has(a.group));
            } else {
                return []; // No students match, so no assignments should be shown
            }
        }

        return assignments;
    }, [assignmentsForWeek, filters, focusedInstructor, groupCompanyMap, groupInfo, globalSearchTerm, allStudents]);


    const teachingLoad = useMemo(() => {
        const counts: { [key: string]: { count: number; type: 'tech' | 'english' } } = {};
    
        // Only calculate load for instructors active in the currently selected week type's schedule.
        const relevantInstructors = new Set<string>();
        assignmentsForWeek.forEach(assignment => {
            assignment.instructors.forEach(inst => {
                if (allInstructors.tech.includes(inst) || allInstructors.english.includes(inst)) {
                    relevantInstructors.add(inst);
                }
            });
        });

        relevantInstructors.forEach(instructor => {
            const assignmentsForInstructor = filteredAssignments.filter(a => a.instructors.includes(instructor));
            if (assignmentsForInstructor.length > 0) {
                const type = assignmentsForInstructor[0].type === 'Technical' ? 'tech' : 'english';
                counts[instructor] = { count: assignmentsForInstructor.length, type };
            }
        });

        return Object.entries(counts).map(([instructor, data]) => ({
            instructor,
            count: data.count,
            type: data.type
        }));
    }, [filteredAssignments, assignmentsForWeek]);

    const showTooltip = (content: React.ReactNode, e: React.MouseEvent) => setTooltipState({ content, position: {x: e.clientX, y: e.clientY} });
    const hideTooltip = () => setTooltipState(null);
    const handleDayClick = (day: Assignment['day']) => {
        setSelectedDay(day);
        setViewMode('daily');
    };

    const renderView = () => {
        switch (viewMode) {
            case 'weekly':
                return <WeeklyScheduleView 
                            assignments={filteredAssignments} 
                            onDayClick={handleDayClick} 
                            density={density}
                            selectedDay={selectedDay}
                            liveToday={liveDay}
                            currentPeriod={currentPeriod}
                            focusedInstructor={focusedInstructor}
                            setFocusedInstructor={setFocusedInstructor}
                            showTooltip={showTooltip}
                            hideTooltip={hideTooltip}
                        />;
            case 'daily':
                return <DailyScheduleView
                            assignments={filteredAssignments}
                            selectedDay={selectedDay}
                            isLiveDay={selectedDay === liveDay}
                            density={density}
                            currentPeriod={currentPeriod}
                            focusedInstructor={focusedInstructor}
                            setFocusedInstructor={setFocusedInstructor}
                            showTooltip={showTooltip}
                            hideTooltip={hideTooltip}
                        />;
            case 'table':
                return <DailyTimetableView 
                            periods={dailySchedule}
                            assignments={filteredAssignments.filter(a => a.day === selectedDay)}
                            selectedDay={selectedDay}
                            isLiveDay={selectedDay === liveDay}
                            currentPeriod={currentPeriod}
                            groupInfo={groupInfo}
                            focusedInstructor={focusedInstructor}
                        />;
            case 'load':
                return <TeachingLoad 
                            loadData={teachingLoad} 
                            focusedInstructor={focusedInstructor}
                            setFocusedInstructor={setFocusedInstructor}
                        />;
            default: return null;
        }
    }
    
    return (
        <div className="h-full flex flex-col gap-4">
            <Tooltip content={tooltipState?.content} position={tooltipState?.position} />
            <div className="flex-shrink-0 flex flex-col md:flex-row justify-between items-center gap-4 p-3 bg-bg-panel border border-slate-200 rounded-lg shadow-sm">
                 <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1">
                    <WeekButton label="Odd Week" type="odd" activeType={weekType} isLive={!isEvenWeek} onClick={setWeekType}/>
                    <WeekButton label="Even Week" type="even" activeType={weekType} isLive={isEvenWeek} onClick={setWeekType}/>
                </div>
                
                <div className="flex items-center gap-3">
                     { (viewMode === 'weekly' || viewMode === 'daily') &&
                        <div className="flex items-center bg-slate-100 rounded-full p-1">
                            <button onClick={() => setDensity('comfortable')} className={`px-3 py-1 text-sm font-semibold rounded-full ${density === 'comfortable' ? 'bg-white shadow' : ''}`}>Comfortable</button>
                            <button onClick={() => setDensity('compact')} className={`px-3 py-1 text-sm font-semibold rounded-full ${density === 'compact' ? 'bg-white shadow' : ''}`}>Compact</button>
                        </div>
                    }
                    <div className="flex items-center bg-slate-100 rounded-full p-1">
                        <button onClick={() => setViewMode('weekly')} className={`px-3 py-1 text-sm font-semibold rounded-full ${viewMode === 'weekly' ? 'bg-white shadow' : ''}`}>Weekly Grid</button>
                        <button onClick={() => setViewMode('daily')} className={`px-3 py-1 text-sm font-semibold rounded-full ${viewMode === 'daily' ? 'bg-white shadow' : ''}`}>Daily Grid</button>
                        <button onClick={() => setViewMode('table')} className={`px-3 py-1 text-sm font-semibold rounded-full ${viewMode === 'table' ? 'bg-white shadow' : ''}`}>Daily Table</button>
                        <button onClick={() => setViewMode('load')} className={`px-3 py-1 text-sm font-semibold rounded-full ${viewMode === 'load' ? 'bg-white shadow text-brand-primary' : ''}`}>Teaching Load</button>
                    </div>
                </div>

                 { (viewMode === 'daily' || viewMode === 'table') &&
                    <div className="flex items-center bg-slate-100 rounded-full p-1">
                        {DAYS.map(day => <button key={day} onClick={() => setSelectedDay(day)} className={`px-3 py-1 text-sm font-semibold rounded-full ${selectedDay === day ? 'bg-white shadow' : ''}`}>{day.substring(0,3)}</button>)}
                    </div>
                }
            </div>

             {(activeFilterCount > 0 || focusedInstructor || globalSearchTerm) && (
                <div className="flex-shrink-0 flex flex-wrap items-center gap-4 text-sm font-semibold text-indigo-800 bg-indigo-100 p-3 rounded-lg">
                    <span>Filtered View:</span>
                    {activeFilterCount > 0 && <span className="font-mono bg-white/50 px-2 py-0.5 rounded-md">{activeFilterCount} global filters active.</span>}
                    {globalSearchTerm && <span className="font-mono bg-white/50 px-2 py-0.5 rounded-md">Search: "{globalSearchTerm}"</span>}
                    {focusedInstructor && <span className="font-mono bg-white/50 px-2 py-0.5 rounded-md">Focused on {focusedInstructor}.</span>}
                    {focusedInstructor && <button onClick={() => setFocusedInstructor(null)} className="font-bold text-red-500 hover:underline">Clear Focus</button>}
                </div>
            )}

            <div className="flex-grow min-h-0">
                {renderView()}
            </div>
        </div>
    );
};

export default InstructorSchedulePage;