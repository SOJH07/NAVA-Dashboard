import type { GroupInfo, FloorPlanItem, DailyPeriod, Student } from '../types';
import { studentsFixture } from './students';
import { dailyPeriodsFixture } from './dailyPeriods';
import { groupSchedulesFixture } from './groupSchedules';
import { curriculumFixture } from './curriculum';
import { floorPlanLayoutFixture } from './floorPlan';

// Re-exporting fixture data
export const students: Student[] = studentsFixture;
export const dailySchedule: DailyPeriod[] = dailyPeriodsFixture;
export const floorPlanLayout: FloorPlanItem[] = floorPlanLayoutFixture;

// Combining schedule and curriculum into groupInfo
const combinedGroupInfo: { [key:string]: { schedule_type?: string; curriculum_name?: string; track_name?: string; } } = {};

groupSchedulesFixture.forEach(schedule => {
    if (!combinedGroupInfo[schedule.group_name]) {
        combinedGroupInfo[schedule.group_name] = {};
    }
    combinedGroupInfo[schedule.group_name].schedule_type = schedule.schedule_type;
});

curriculumFixture.forEach(curriculum => {
    if (!combinedGroupInfo[curriculum.group_name]) {
        combinedGroupInfo[curriculum.group_name] = {};
    }
    combinedGroupInfo[curriculum.group_name].curriculum_name = curriculum.curriculum_name;
    combinedGroupInfo[curriculum.group_name].track_name = curriculum.track_name;
});

// Fill in missing properties to satisfy GroupInfo type
export const groupInfo: GroupInfo = {};
for (const groupName in combinedGroupInfo) {
    groupInfo[groupName] = {
        schedule_type: combinedGroupInfo[groupName].schedule_type || '',
        curriculum_name: combinedGroupInfo[groupName].curriculum_name || '',
        track_name: combinedGroupInfo[groupName].track_name || '',
    };
}
