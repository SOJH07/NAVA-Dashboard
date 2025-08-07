import { create } from 'zustand';
import type { Assignment } from '../types';
import { processedScheduleData } from '../data/scheduleData';

type ScheduleState = {
    assignments: Assignment[];
    weekType: 'odd' | 'even';
    setWeekType: (weekType: 'odd' | 'even') => void;
    getAssignmentsForWeek: () => Assignment[];
};

const useScheduleStore = create<ScheduleState>((set, get) => ({
    assignments: processedScheduleData,
    weekType: 'even', // Default week type

    setWeekType: (weekType) => set({ weekType }),

    getAssignmentsForWeek: () => {
        const { assignments, weekType } = get();
        return assignments.filter(assignment => assignment.weekType === weekType);
    },
}));

export default useScheduleStore;