import { useState, useEffect, useMemo } from 'react';
import type { EnhancedStudent, DailyPeriod, GroupInfo, LiveStudent, OccupancyData, LiveClass, Assignment } from '../types';

/**
 * Calculates the academy week number based on a fixed anchor date.
 * This ensures the week number is consistent regardless of client timezone.
 * @param d The current date.
 * @returns The academy-specific week number.
 */
const getWeekNumber = (d: Date): number => {
    // Anchor date for week calculation, set to a Sunday. Calibrated so that July 20, 2025 falls in Week 40.
    const academyStartDate = new Date(Date.UTC(2024, 9, 20)); // October is month 9 (0-indexed)
    const currentDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

    // Calculate the difference in days from the start date.
    const diffTime = currentDate.getTime() - academyStartDate.getTime();
    
    // If the current date is before the start date, default to Week 1.
    if (diffTime < 0) {
        return 1;
    }
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // The week number is 1 (for the first week) + the number of full weeks that have passed.
    const weekNumber = Math.floor(diffDays / 7) + 1;

    return weekNumber;
};


const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

export const useLiveStatus = (
    enhancedStudents: EnhancedStudent[],
    dailySchedule: DailyPeriod[],
    groupInfo: GroupInfo,
    scheduleAssignments: Assignment[]
) => {
    const [now, setNow] = useState(new Date());
    const [externalData, setExternalData] = useState<{ occupancy: OccupancyData; liveStudents: LiveStudent[]; liveClasses: LiveClass[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const timerId = setInterval(() => setNow(new Date()), 1000); // Update every second for live timer
        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        const fetchLiveStatus = async () => {
            try {
                const res = await fetch('/api/live-status');
                if (!res.ok) throw new Error('Failed to fetch live status');
                const data = await res.json();
                setExternalData(data);
                setError(null);
            } catch (e) {
                setError(e as Error);
            } finally {
                setLoading(false);
            }
        };
        fetchLiveStatus();
        const interval = setInterval(fetchLiveStatus, 10000); // poll every 10s
        return () => clearInterval(interval);
    }, []);

    const weekNumber = useMemo(() => getWeekNumber(now), [now]);
    const isEvenWeek = useMemo(() => weekNumber % 2 === 0, [weekNumber]);
    const nowMinutes = useMemo(() => now.getHours() * 60 + now.getMinutes(), [now]);

    const currentPeriod = useMemo<DailyPeriod | null>(() => {
        return dailySchedule.find(p => {
            const startMinutes = timeToMinutes(p.start);
            const endMinutes = timeToMinutes(p.end);
            return nowMinutes >= startMinutes && nowMinutes < endMinutes;
        }) || null;
    }, [nowMinutes, dailySchedule]);

    const overallStatus = useMemo<string>(() => {
        if (!currentPeriod) {
            if (dailySchedule.length > 0 && nowMinutes < timeToMinutes(dailySchedule[0].start)) {
                return 'Upcoming';
            }
            return 'Finished';
        }
        if (currentPeriod.type === 'class') {
            return 'In Class';
        }
        return currentPeriod.name; // 'Break' or 'Lunch'
    }, [currentPeriod, nowMinutes, dailySchedule]);

    const liveData = useMemo(() => {
        const occupancy: OccupancyData = {};
        const liveStudents: LiveStudent[] = [];
        
        // Create a lookup map for the current period's assignments for fast access.
        const assignmentMap = new Map<string, Assignment>();
        if (currentPeriod) {
            scheduleAssignments
                .filter(a => a.weekType === (isEvenWeek ? 'even' : 'odd') && a.period === currentPeriod.name)
                .forEach(a => {
                    assignmentMap.set(a.group, a);
                });
        }
        
        const firstPeriodStart = dailySchedule.length > 0 ? timeToMinutes(dailySchedule[0].start) : 0;
        const isUpcoming = nowMinutes < firstPeriodStart;
        const upcomingStatus: LiveStudent['status'] = 'Upcoming';
        
        if (!currentPeriod && isUpcoming) {
            for (const student of enhancedStudents) {
                liveStudents.push({ ...student, location: 'Not started', status: upcomingStatus, currentPeriod: 'N/A' });
            }
            return { occupancy, liveClasses: [], liveStudents };
        }

        // During or after school day
        for (const student of enhancedStudents) {
            let location = 'N/A';
            let status: LiveStudent['status'] = 'Finished';
            let periodName = currentPeriod?.name || 'N/A';
            let currentClassInfo: { group: string, type: 'tech' | 'english', classroom: string } | null = null;
            
            if (currentPeriod) {
                if (currentPeriod.type === 'break') {
                    location = 'On Break';
                    status = 'Break';
                } else {
                    // It's a class period. Determine the student's subject based on their tech group's schedule.
                    const isMorningPeriod = ['P1', 'P2', 'P3', 'P4'].includes(currentPeriod.name);
                    const techScheduleInfo = groupInfo[student.techGroup];

                    if (techScheduleInfo) {
                        const techIsMorningThisWeek = techScheduleInfo.schedule_type.startsWith(isEvenWeek ? 'even' : 'odd');
                        let studentCurrentSubject: 'tech' | 'english' | null = null;
                        
                        if (isMorningPeriod) {
                            studentCurrentSubject = techIsMorningThisWeek ? 'tech' : 'english';
                        } else { // Afternoon period
                            studentCurrentSubject = techIsMorningThisWeek ? 'english' : 'tech';
                        }
                        
                        if (studentCurrentSubject) {
                            status = 'In Class';
                            let assignment: Assignment | undefined;
                            let group: string;
                            let fallbackClass: string;

                            if (studentCurrentSubject === 'tech') {
                                group = student.techGroup;
                                fallbackClass = student.techClass;
                                assignment = assignmentMap.get(group);
                            } else {
                                group = student.englishGroup;
                                fallbackClass = student.englishClass;
                                assignment = assignmentMap.get(group);
                            }
                            
                            const classroom = assignment ? assignment.classroom : fallbackClass;
                            const locationPrefix = studentCurrentSubject === 'tech' ? 'Tech' : 'English';
                            location = `${locationPrefix}: C-${classroom.replace('.', '')}`;
                            currentClassInfo = { group, type: studentCurrentSubject, classroom };
                        }
                    }
                }
            }
            
            liveStudents.push({ ...student, location, status, currentPeriod: periodName });
            
            if (currentClassInfo) {
                occupancy[currentClassInfo.classroom] = {
                    group: currentClassInfo.group,
                    type: currentClassInfo.type,
                };
            }
        }

        const liveClasses: LiveClass[] = Object.entries(occupancy)
            .map(([classroom, info]) => info ? ({ ...info, classroom }) : null)
            .filter((c): c is LiveClass => c !== null)
            .sort((a, b) => a.classroom.localeCompare(b.classroom));

        return { occupancy, liveClasses, liveStudents };

    }, [enhancedStudents, nowMinutes, currentPeriod, isEvenWeek, groupInfo, dailySchedule, scheduleAssignments]);

    const finalData = externalData || liveData;

    return { now, weekNumber, isEvenWeek, currentPeriod, ...finalData, overallStatus, loading, error };
};