import React, { useMemo } from 'react';
import type { Assignment, DailyPeriod } from '../types';
import { dailyPeriodsData } from '../data/dailyPeriods';
import DailyAssignmentCard from './DailyAssignmentCard';

interface DailyScheduleViewProps {
    assignments: Assignment[];
    selectedDay: Assignment['day'];
    isLiveDay: boolean;
    density: 'comfortable' | 'compact';
    currentPeriod: DailyPeriod | null;
    focusedInstructor: string | null;
    setFocusedInstructor: (instructor: string | null) => void;
    showTooltip: (content: React.ReactNode, e: React.MouseEvent) => void;
    hideTooltip: () => void;
}

const processAssignmentsForGrid = (assignments: Assignment[]) => {
    const assignmentsByGroup: { [group: string]: Assignment[] } = {};
    assignments.forEach(a => {
        if (!assignmentsByGroup[a.group]) {
            assignmentsByGroup[a.group] = [];
        }
        assignmentsByGroup[a.group].push(a);
    });

    Object.values(assignmentsByGroup).forEach(groupAssignments => {
        groupAssignments.sort((a, b) => parseInt(a.period.substring(1)) - parseInt(b.period.substring(1)));
    });
    
    const sortedGroups = Object.keys(assignmentsByGroup).sort();

    const blocks: (Assignment & { span: number })[] = [];
    const processedIds = new Set<number>();

    sortedGroups.forEach(group => {
        const groupAssignments = assignmentsByGroup[group];
        for (const assignment of groupAssignments) {
            if (processedIds.has(assignment.id)) continue;

            let span = 1;
            processedIds.add(assignment.id);
            
            let currentPeriodNum = parseInt(assignment.period.substring(1));
            for (let i = groupAssignments.indexOf(assignment) + 1; i < groupAssignments.length; i++) {
                const nextAssignment = groupAssignments[i];
                const nextPeriodNum = parseInt(nextAssignment.period.substring(1));
                if (nextPeriodNum === currentPeriodNum + 1 && nextAssignment.topic === assignment.topic && nextAssignment.instructors.join(',') === assignment.instructors.join(',')) {
                    span++;
                    currentPeriodNum++;
                    processedIds.add(nextAssignment.id);
                } else {
                    break;
                }
            }
            blocks.push({ ...assignment, span });
        }
    });

    return { blocks, groups: sortedGroups };
};

const ScheduleSection: React.FC<{
    title: string;
    type: 'Technical' | 'English';
    groups: string[];
    blocks: (Assignment & { span: number })[];
    periodRowMap: {[key: string]: number};
    density: 'comfortable' | 'compact';
    isLiveDay: boolean;
    currentPeriod: DailyPeriod | null;
    focusedInstructor: string | null;
    setFocusedInstructor: (instructor: string | null) => void;
    showTooltip: (content: React.ReactNode, e: React.MouseEvent) => void;
    hideTooltip: () => void;
}> = ({ title, type, groups, blocks, periodRowMap, density, isLiveDay, currentPeriod, focusedInstructor, setFocusedInstructor, showTooltip, hideTooltip }) => {
    if (groups.length === 0) return null;
    
    const isTech = type === 'Technical';
    const gridTemplateColumns = `minmax(4rem, auto) repeat(${groups.length}, minmax(0, 1fr))`;

    return (
        <div className="mb-8">
            <h3 className={`text-xl font-bold mb-3 px-1 ${isTech ? 'text-status-tech' : 'text-status-english'}`}>{title}</h3>
            <div className="bg-bg-panel border border-slate-200 rounded-lg shadow-sm overflow-x-auto">
                <div className="grid" style={{ gridTemplateColumns }}>
                    {/* Header */}
                    <div className="sticky top-0 bg-slate-50 z-10 grid grid-cols-1" style={{ gridColumn: '1 / -1', gridTemplateColumns }}>
                        <div className="border-b border-r border-slate-200"></div>
                        {groups.map(g => <div key={g} className="font-bold text-sm p-3 text-center border-b border-r border-slate-200 last:border-r-0 truncate">{g}</div>)}
                    </div>
                    {/* Body */}
                    <div className="grid col-start-1 col-span-full row-start-2" style={{ gridTemplateColumns }}>
                         {/* Time labels & Grid Lines */}
                        <div className="col-start-1 row-start-1 grid divide-y divide-slate-200">
                            {Object.keys(periodRowMap).map(p => {
                                const isLive = isLiveDay && currentPeriod?.name === p;
                                return (
                                    <div key={p} className={`flex items-center justify-center border-r border-slate-200 text-sm transition-colors ${density === 'comfortable' ? 'h-28' : 'h-24'} ${isLive ? 'bg-amber-100 text-amber-700 font-extrabold' : 'text-slate-400 font-bold'}`}>
                                        {p}
                                    </div>
                                );
                            })}
                        </div>
                        {/* Columns for groups */}
                        <div className="col-start-2 col-span-full row-start-1 grid" style={{ gridTemplateColumns: `repeat(${groups.length}, minmax(0, 1fr))`}}>
                            {groups.map((group) => (
                                <div key={group} className="grid divide-y divide-slate-200">
                                    {Object.keys(periodRowMap).map(p => (
                                        <div key={p} className={`border-r border-slate-200 last:border-r-0 ${density === 'comfortable' ? 'h-28' : 'h-24'}`}></div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        
                        {/* Assignments */}
                        <div className="col-start-1 col-span-full row-start-1 grid z-0" style={{ gridTemplateColumns }}>
                             {blocks.map(block => {
                                const col = groups.indexOf(block.group) + 2;
                                const row = periodRowMap[block.period];
                                if (!row) return null;

                                const startPeriodNum = parseInt(block.period.substring(1));
                                const endPeriodNum = startPeriodNum + block.span - 1;
                                const currentPeriodNum = currentPeriod ? parseInt(currentPeriod.name.substring(1)) : -1;
                                const isLive = isLiveDay && currentPeriodNum >= startPeriodNum && currentPeriodNum <= endPeriodNum;
                                
                                return (
                                    <div key={block.id} style={{ gridColumn: col, gridRow: `${row} / span ${block.span}`}} className="p-1.5 flex">
                                        <DailyAssignmentCard 
                                            assignment={block} 
                                            density={density}
                                            isLive={isLive}
                                            focusedInstructor={focusedInstructor}
                                            setFocusedInstructor={setFocusedInstructor}
                                            showTooltip={showTooltip}
                                            hideTooltip={hideTooltip}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const DailyScheduleView: React.FC<DailyScheduleViewProps> = ({ assignments, selectedDay, isLiveDay, density, currentPeriod, focusedInstructor, setFocusedInstructor, showTooltip, hideTooltip }) => {
    
    const dayAssignments = useMemo(() => assignments.filter(a => a.day === selectedDay), [assignments, selectedDay]);

    const { blocks: techBlocks, groups: techGroups } = useMemo(() => processAssignmentsForGrid(dayAssignments.filter(a => a.type === 'Technical')), [dayAssignments]);
    const { blocks: englishBlocks, groups: englishGroups } = useMemo(() => processAssignmentsForGrid(dayAssignments.filter(a => a.type === 'English')), [dayAssignments]);

    const classPeriods = useMemo(() => dailyPeriodsData.filter(p => p.type === 'class'), []);
    
    const periodRowMap = useMemo(() => {
        const map: {[key: string]: number} = {};
        classPeriods.forEach((p, i) => {
            map[p.name] = i + 1;
        });
        return map;
    }, [classPeriods]);

    const hasAssignments = techBlocks.length > 0 || englishBlocks.length > 0;

    return (
        <div className="h-full overflow-y-auto">
            {!hasAssignments ? (
                 <div className="bg-bg-panel border border-slate-200 rounded-lg shadow-sm h-full flex flex-col items-center justify-center text-text-muted">
                    <h3 className="text-xl font-bold">No assignments scheduled for {selectedDay}.</h3>
                    <p>This may be a non-teaching day or the schedule is not available.</p>
                </div>
            ) : (
                <div className="p-1">
                    <ScheduleSection 
                        title="Technical Sessions"
                        type="Technical"
                        groups={techGroups}
                        blocks={techBlocks}
                        periodRowMap={periodRowMap}
                        density={density}
                        isLiveDay={isLiveDay}
                        currentPeriod={currentPeriod}
                        focusedInstructor={focusedInstructor}
                        setFocusedInstructor={setFocusedInstructor}
                        showTooltip={showTooltip}
                        hideTooltip={hideTooltip}
                    />
                    <ScheduleSection
                        title="English Sessions"
                        type="English"
                        groups={englishGroups}
                        blocks={englishBlocks}
                        periodRowMap={periodRowMap}
                        density={density}
                        isLiveDay={isLiveDay}
                        currentPeriod={currentPeriod}
                        focusedInstructor={focusedInstructor}
                        setFocusedInstructor={setFocusedInstructor}
                        showTooltip={showTooltip}
                        hideTooltip={hideTooltip}
                    />
                </div>
            )}
        </div>
    );
};

export default DailyScheduleView;
