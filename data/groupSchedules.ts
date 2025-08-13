import type { GroupSchedule } from '../types';

// Fixture used for development and tests
export const groupSchedulesFixture: GroupSchedule[] = [
    // EVEN WEEK MORNING GROUPS
    { group_name: 'G1', schedule_type: 'evenWeekMorningEnglish' },
    { group_name: 'G2', schedule_type: 'evenWeekMorningEnglish' },
    { group_name: 'G3', schedule_type: 'evenWeekMorningEnglish' },
    { group_name: 'G4', schedule_type: 'evenWeekMorningEnglish' },
    { group_name: 'G5', schedule_type: 'evenWeekMorningEnglish' },
    { group_name: 'G6', schedule_type: 'evenWeekMorningEnglish' },
    { group_name: 'G7', schedule_type: 'evenWeekMorningEnglish' },
    { group_name: 'DPST-01', schedule_type: 'evenWeekMorningTech' },
    { group_name: 'DPIT-02', schedule_type: 'evenWeekMorningTech' },
    { group_name: 'DPIT-04', schedule_type: 'evenWeekMorningTech' },
    { group_name: 'DPIT-06', schedule_type: 'evenWeekMorningTech' },
    { group_name: 'DPST-03', schedule_type: 'evenWeekMorningTech' },
    { group_name: 'DFPD-02', schedule_type: 'evenWeekMorningTech' },
    
    // ODD WEEK MORNING GROUPS
    { group_name: 'G8', schedule_type: 'oddWeekMorningEnglish' },
    { group_name: 'G9', schedule_type: 'oddWeekMorningEnglish' },
    { group_name: 'G10', schedule_type: 'oddWeekMorningEnglish' },
    { group_name: 'G11', schedule_type: 'oddWeekMorningEnglish' },
    { group_name: 'G12', schedule_type: 'oddWeekMorningEnglish' },
    { group_name: 'G13', schedule_type: 'oddWeekMorningEnglish' },
    { group_name: 'DPIT-01', schedule_type: 'oddWeekMorningTech' },
    { group_name: 'DFPD-01', schedule_type: 'oddWeekMorningTech' },
    { group_name: 'DPIT-03', schedule_type: 'oddWeekMorningTech' },
    { group_name: 'DPIT-05', schedule_type: 'oddWeekMorningTech' },
    { group_name: 'DPST-02', schedule_type: 'oddWeekMorningTech' },
    { group_name: 'DPIT-07', schedule_type: 'oddWeekMorningTech' },
];

// Backwards compatibility export
export const groupSchedulesData = groupSchedulesFixture;