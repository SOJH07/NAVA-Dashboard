import type { Assignment } from '../types';

export const allInstructors = {
  tech: [
    'Abdul Basit',
    'Ali Sameh',
    'Amr',
    'Asif',
    'Azfar Ali',
    'Fahd',
    'Haris',
    'Moazzam',
    'Muhammad Fathi',
    'Muteeb',
    'Sajid Rahman',
    'Sikandar',
    'Venkata',
    'Zahid'
  ].sort(),
  english: [
    'Ashfaq M',
    'El-Sayed H',
    'Eldaw A',
    'Hussain A',
    'Jawish A',
    'Khan N',
    'Singh A'
  ].sort(),
};

const rawScheduleOdd = [
    // --- SUNDAY, July 27, 2025 ---
    { Day: 'Sunday', Period: 'P 1 to 4', Group: 'DPIT-01', CLASS_ROOM: '2.04', Trainer: 'Venkata', Topic: 'Unit 9' },
    { Day: 'Sunday', Period: 'P 1 to 4', Group: 'DPIT-03', CLASS_ROOM: '2.18', Trainer: 'Muhammad Fathi', Topic: 'Unit 9' },
    { Day: 'Sunday', Period: 'P 1 to 4', Group: 'DPIT-05', CLASS_ROOM: '2.08 / WS-06', Trainer: 'Sikandar', Topic: 'Unit 6' },
    { Day: 'Sunday', Period: 'P 1 to 4', Group: 'DPIT-07', CLASS_ROOM: '2.01 / WS-11', Trainer: 'Fahd', Topic: 'Unit 6' },
    { Day: 'Sunday', Period: 'P 1 to 4', Group: 'DPST-02', CLASS_ROOM: '2.02 / WS-11', Trainer: 'Abdul Basit', Topic: 'Unit 6' },
    { Day: 'Sunday', Period: 'P 1 to 4', Group: 'DPFD-01(DPST-04)', CLASS_ROOM: '2.10 / WS-06', Trainer: 'Sajid Rahman', Topic: 'Unit 6' },
    { Day: 'Sunday', Period: 'P 5 to 7', Group: 'DPIT-02', CLASS_ROOM: '2.08', Trainer: 'Venkata', Topic: 'Unit 9' },
    { Day: 'Sunday', Period: 'P 5 to 7', Group: 'DPIT-04', CLASS_ROOM: '2.13', Trainer: 'Muhammad Fathi', Topic: 'Unit 9' },
    { Day: 'Sunday', Period: 'P 5 to 7', Group: 'DPIT-06', CLASS_ROOM: '2.15 / WS-06', Trainer: 'Sikandar', Topic: 'Unit 6' },
    { Day: 'Sunday', Period: 'P 5 to 7', Group: 'DPST-01', CLASS_ROOM: '2.11 / WS-11', Trainer: 'Fahd', Topic: 'Unit 6' },
    { Day: 'Sunday', Period: 'P 5 to 7', Group: 'DPST-03', CLASS_ROOM: '2.05 / WS-11', Trainer: 'Abdul Basit', Topic: 'Unit 6' },
    { Day: 'Sunday', Period: 'P 5 to 7', Group: 'DPFD-02(DPIT-08)', CLASS_ROOM: '2.09 / WS-06', Trainer: 'Sajid Rahman', Topic: 'Unit 6' },

    // --- MONDAY, July 28, 2025 ---
    { Day: 'Monday', Period: 'P 1 to 4', Group: 'DPIT-01', CLASS_ROOM: '2.04', Trainer: 'Ali Sameh', Topic: 'Unit 9-LN' },
    { Day: 'Monday', Period: 'P 1 to 4', Group: 'DPIT-03', CLASS_ROOM: '2.18', Trainer: 'Azfar Ali', Topic: 'Unit 9-LN' },
    { Day: 'Monday', Period: 'P 1 to 4', Group: 'DPIT-05', CLASS_ROOM: '2.08 / WS-06', Trainer: 'Sikandar', Topic: 'Unit 9' },
    { Day: 'Monday', Period: 'P 1 to 4', Group: 'DPIT-07', CLASS_ROOM: '2.01 / WS-11', Trainer: 'Abdul Basit', Topic: 'Unit 9' },
    { Day: 'Monday', Period: 'P 1 to 4', Group: 'DPST-02', CLASS_ROOM: '2.02 / WS-11', Trainer: 'Sajid Rahman', Topic: 'Unit 9' },
    { Day: 'Monday', Period: 'P 1 to 4', Group: 'DPFD-01(DPST-04)', CLASS_ROOM: '2.10 / WS-06', Trainer: 'Fahd', Topic: 'Unit 9' },
    { Day: 'Monday', Period: 'P 5 to 7', Group: 'DPIT-02', CLASS_ROOM: '2.08', Trainer: 'Sajid Rahman', Topic: 'Unit 9-LN' },
    { Day: 'Monday', Period: 'P 5 to 7', Group: 'DPIT-04', CLASS_ROOM: '2.13', Trainer: 'Sikandar', Topic: 'Unit 9-LN' },
    { Day: 'Monday', Period: 'P 5 to 7', Group: 'DPIT-06', CLASS_ROOM: '2.15 / WS-06', Trainer: 'Amr', Topic: 'Unit 9' },
    { Day: 'Monday', Period: 'P 5 to 7', Group: 'DPST-01', CLASS_ROOM: '2.11 / WS-11', Trainer: 'Abdul Basit', Topic: 'Unit 9' },
    { Day: 'Monday', Period: 'P 5 to 7', Group: 'DPST-03', CLASS_ROOM: '2.05 / WS-11', Trainer: 'Muhammad Fathi', Topic: 'Unit 9' },
    { Day: 'Monday', Period: 'P 5 to 7', Group: 'DPFD-02(DPIT-08)', CLASS_ROOM: '2.09 / WS-06', Trainer: 'Fahd', Topic: 'Unit 9' },

    // --- TUESDAY, July 29, 2025 ---
    { Day: 'Tuesday', Period: 'P 1 to 4', Group: 'DPIT-01', CLASS_ROOM: '2.04', Trainer: 'Venkata', Topic: 'Unit 9' },
    { Day: 'Tuesday', Period: 'P 1 to 4', Group: 'DPIT-03', CLASS_ROOM: '2.18', Trainer: 'Muhammad Fathi', Topic: 'Unit 9' },
    { Day: 'Tuesday', Period: 'P 1 to 4', Group: 'DPIT-05', CLASS_ROOM: '2.08 / WS-06', Trainer: 'Ali Sameh', Topic: 'Unit 9-LN' },
    { Day: 'Tuesday', Period: 'P 1 to 4', Group: 'DPIT-07', CLASS_ROOM: '2.01 / WS-11', Trainer: 'Moazzam', Topic: 'Unit 9-LN' },
    { Day: 'Tuesday', Period: 'P 1 to 4', Group: 'DPST-02', CLASS_ROOM: '2.02 / WS-11', Trainer: 'Sajid Rahman', Topic: 'Unit 9' },
    { Day: 'Tuesday', Period: 'P 1 to 4', Group: 'DPFD-01(DPST-04)', CLASS_ROOM: '2.10 / WS-06', Trainer: 'Fahd', Topic: 'Unit 9' },
    { Day: 'Tuesday', Period: 'P 5 to 7', Group: 'DPIT-02', CLASS_ROOM: '2.08', Trainer: 'Venkata', Topic: 'Unit 9' },
    { Day: 'Tuesday', Period: 'P 5 to 7', Group: 'DPIT-04', CLASS_ROOM: '2.13', Trainer: 'Muhammad Fathi', Topic: 'Unit 9' },
    { Day: 'Tuesday', Period: 'P 5 to 7', Group: 'DPIT-06', CLASS_ROOM: '2.15 / WS-06', Trainer: 'Sajid Rahman', Topic: 'Unit 9-LN' },
    { Day: 'Tuesday', Period: 'P 5 to 7', Group: 'DPST-01', CLASS_ROOM: '2.11 / WS-11', Trainer: 'Azfar Ali', Topic: 'Unit 9-LN' },
    { Day: 'Tuesday', Period: 'P 5 to 7', Group: 'DPST-03', CLASS_ROOM: '2.05 / WS-11', Trainer: 'Sikandar', Topic: 'Unit 9' },
    { Day: 'Tuesday', Period: 'P 5 to 7', Group: 'DPFD-02(DPIT-08)', CLASS_ROOM: '2.09 / WS-06', Trainer: 'Fahd', Topic: 'Unit 9' },

    // --- WEDNESDAY, July 30, 2025 ---
    { Day: 'Wednesday', Period: 'P 1 to 4', Group: 'DPIT-01', CLASS_ROOM: '2.04', Trainer: 'Venkata', Topic: 'Unit 9' },
    { Day: 'Wednesday', Period: 'P 1 to 4', Group: 'DPIT-03', CLASS_ROOM: '2.18', Trainer: 'Muhammad Fathi', Topic: 'Unit 9' },
    { Day: 'Wednesday', Period: 'P 1 to 4', Group: 'DPIT-05', CLASS_ROOM: '2.08 / WS-06', Trainer: 'Zahid', Topic: 'Unit 9' },
    { Day: 'Wednesday', Period: 'P 1 to 4', Group: 'DPIT-07', CLASS_ROOM: '2.01 / WS-11', Trainer: 'Abdul Basit', Topic: 'Unit 9' },
    { Day: 'Wednesday', Period: 'P 1 to 4', Group: 'DPST-02', CLASS_ROOM: '2.02 / WS-11', Trainer: 'Ali Sameh', Topic: 'Unit 9-LN' },
    { Day: 'Wednesday', Period: 'P 1 to 4', Group: 'DPFD-01(DPST-04)', CLASS_ROOM: '2.10 / WS-06', Trainer: 'Sikandar', Topic: 'Unit 9-LN' },
    { Day: 'Wednesday', Period: 'P 5 to 7', Group: 'DPIT-02', CLASS_ROOM: '2.08', Trainer: 'Venkata', Topic: 'Unit 9' },
    { Day: 'Wednesday', Period: 'P 5 to 7', Group: 'DPIT-04', CLASS_ROOM: '2.13', Trainer: 'Muhammad Fathi', Topic: 'Unit 9' },
    { Day: 'Wednesday', Period: 'P 5 to 7', Group: 'DPIT-06', CLASS_ROOM: '2.15 / WS-06', Trainer: 'Sikandar', Topic: 'Unit 9' },
    { Day: 'Wednesday', Period: 'P 5 to 7', Group: 'DPST-01', CLASS_ROOM: '2.11 / WS-11', Trainer: 'Abdul Basit', Topic: 'Unit 9' },
    { Day: 'Wednesday', Period: 'P 5 to 7', Group: 'DPST-03', CLASS_ROOM: '2.05 / WS-11', Trainer: 'Sajid Rahman', Topic: 'Unit 9-LN' },
    { Day: 'Wednesday', Period: 'P 5 to 7', Group: 'DPFD-02(DPIT-08)', CLASS_ROOM: '2.09 / WS-06', Trainer: 'Moazzam', Topic: 'Unit 9-LN' },

    // --- THURSDAY, July 31, 2025 ---
    { Day: 'Thursday', Period: 'P 1 to 4', Group: 'DPIT-01', CLASS_ROOM: '2.04', Trainer: 'Venkata', Topic: 'Unit 9' },
    { Day: 'Thursday', Period: 'P 1 to 4', Group: 'DPIT-03', CLASS_ROOM: '2.18', Trainer: 'Muhammad Fathi', Topic: 'Unit 9' },
    { Day: 'Thursday', Period: 'P 1 to 4', Group: 'DPIT-05', CLASS_ROOM: '2.08 / WS-06', Trainer: 'Sikandar', Topic: 'Unit 9' },
    { Day: 'Thursday', Period: 'P 1 to 4', Group: 'DPIT-07', CLASS_ROOM: '2.01 / WS-11', Trainer: 'Abdul Basit', Topic: 'Unit 9' },
    { Day: 'Thursday', Period: 'P 1 to 4', Group: 'DPST-02', CLASS_ROOM: '2.02 / WS-11', Trainer: 'Asif', Topic: 'Unit 9' },
    { Day: 'Thursday', Period: 'P 1 to 4', Group: 'DPFD-01(DPST-04)', CLASS_ROOM: '2.10 / WS-06', Trainer: 'Fahd', Topic: 'Unit 9' },
];


const rawScheduleEven = [
  // Technical Morning
  { Day: 'Sunday', Period: 'P 1 to 4', Group: 'DPIT-02', CLASS_ROOM: '2.08', Trainer: 'Venkata', Topic: 'Unit 8' },
  { Day: 'Sunday', Period: 'P 1 to 4', Group: 'DPIT-04', CLASS_ROOM: '2.13', Trainer: 'Sikandar', Topic: 'Unit 8' },
  { Day: 'Sunday', Period: 'P 1 to 4', Group: 'DPIT-06', CLASS_ROOM: '2.15', Trainer: 'Amr', Topic: 'Unit 5' },
  { Day: 'Sunday', Period: 'P 1 to 4', Group: 'DPST-01', CLASS_ROOM: '2.11', Trainer: 'Fahd', Topic: 'Unit 5' },
  { Day: 'Sunday', Period: 'P 1 to 4', Group: 'DPST-03', CLASS_ROOM: '2.05', Trainer: 'Abdul Basit', Topic: 'Unit 5' },
  { Day: 'Sunday', Period: 'P 1 to 4', Group: 'DPFD-02', CLASS_ROOM: '2.09', Trainer: 'Muteeb', Topic: 'Unit 5' },
  // Technical Afternoon
  { Day: 'Sunday', Period: 'P 5 to 7', Group: 'DPIT-01', CLASS_ROOM: '2.04', Trainer: 'Venkata', Topic: 'Unit 8' },
  { Day: 'Sunday', Period: 'P 5 to 7', Group: 'DPIT-03', CLASS_ROOM: '2.18', Trainer: 'Sikandar', Topic: 'Unit 8' },
  { Day: 'Sunday', Period: 'P 5 to 7', Group: 'DPIT-05', CLASS_ROOM: '2.08', Trainer: 'Amr', Topic: 'Unit 5' },
  { Day: 'Sunday', Period: 'P 5 to 7', Group: 'DPIT-07', CLASS_ROOM: '2.01', Trainer: 'Fahd', Topic: 'Unit 5' },
  { Day: 'Sunday', Period: 'P 5 to 7', Group: 'DPST-02', CLASS_ROOM: '2.02', Trainer: 'Abdul Basit', Topic: 'Unit 5' },
  { Day: 'Sunday', Period: 'P 5 to 7', Group: 'DPFD-01', CLASS_ROOM: '2.10', Trainer: 'Muteeb', Topic: 'Unit 5' },
];

const rawEnglishScheduleOdd_Week41 = [
    // P1 (8:00 - 8:55)
    { Day: 'All', Period: 'P1', Group: 'G9', CLASS_ROOM: '2.17', Teachers: 'Jawish A & Ashfaq M', Topic: 'English Session' },
    { Day: 'All', Period: 'P1', Group: 'G10', CLASS_ROOM: '2.13', Teachers: 'Eldaw A & Hussain A', Topic: 'English Session' },
    { Day: 'All', Period: 'P1', Group: 'G11', CLASS_ROOM: '2.15', Teachers: 'Khan N & El-Sayed H', Topic: 'English Session' },
    { Day: 'All', Period: 'P1', Group: 'G12', CLASS_ROOM: '2.06', Teachers: 'Singh A', Topic: 'English Session' },
    // P2 (8:55 - 9:50)
    { Day: 'All', Period: 'P2', Group: 'G9', CLASS_ROOM: '2.17', Teachers: 'Jawish A & Ashfaq M', Topic: 'English Session' },
    { Day: 'All', Period: 'P2', Group: 'G10', CLASS_ROOM: '2.13', Teachers: 'Eldaw A & Hussain A', Topic: 'English Session' },
    { Day: 'All', Period: 'P2', Group: 'G11', CLASS_ROOM: '2.15', Teachers: 'Khan N & El-Sayed H', Topic: 'English Session' },
    { Day: 'All', Period: 'P2', Group: 'G12', CLASS_ROOM: '2.06', Teachers: 'Singh A', Topic: 'English Session' },
    // P3 (10:10 - 11:05)
    { Day: 'All', Period: 'P3', Group: 'G9', CLASS_ROOM: '2.17', Teachers: 'Jawish A & Ashfaq M', Topic: 'English Session' },
    { Day: 'All', Period: 'P3', Group: 'G10', CLASS_ROOM: '2.13', Teachers: 'Eldaw A & El-Sayed H', Topic: 'English Session' },
    { Day: 'All', Period: 'P3', Group: 'G11', CLASS_ROOM: '2.15', Teachers: 'Khan N & Hussain A', Topic: 'English Session' },
    { Day: 'All', Period: 'P3', Group: 'G12', CLASS_ROOM: '2.06', Teachers: 'Singh A', Topic: 'English Session' },
    // P4 (11:05 - 12:00)
    { Day: 'All', Period: 'P4', Group: 'G9', CLASS_ROOM: '2.17', Teachers: 'El-Sayed H', Topic: 'English Session' },
    { Day: 'All', Period: 'P4', Group: 'G10', CLASS_ROOM: '2.13', Teachers: 'Ashfaq M', Topic: 'English Session' },
    { Day: 'All', Period: 'P4', Group: 'G11', CLASS_ROOM: '2.15', Teachers: 'Hussain A & Khan N', Topic: 'English Session' },
    { Day: 'All', Period: 'P4', Group: 'G12', CLASS_ROOM: '2.06', Teachers: 'Singh A & Jawish A & Eldaw A', Topic: 'English Session' },
    // P5 (12:45 - 1:40)
    { Day: 'All', Period: 'P5', Group: 'G2', CLASS_ROOM: '2.10', Teachers: 'El-Sayed H & Eldaw A', Topic: 'English Session' },
    { Day: 'All', Period: 'P5', Group: 'G3', CLASS_ROOM: '2.18', Teachers: 'Ashfaq M & Khan N', Topic: 'English Session' },
    { Day: 'All', Period: 'P5', Group: 'G4', CLASS_ROOM: '2.05', Teachers: 'Hussain A', Topic: 'English Session' },
    { Day: 'All', Period: 'P5', Group: 'G5', CLASS_ROOM: '2.02', Teachers: 'Jawish A', Topic: 'English Session' },
    { Day: 'All', Period: 'P5', Group: 'G6', CLASS_ROOM: '2.01', Teachers: 'Singh A', Topic: 'English Session' },
    // P6 (1:40 - 2:35)
    { Day: 'All', Period: 'P6', Group: 'G2', CLASS_ROOM: '2.10', Teachers: 'El-Sayed H', Topic: 'English Session' },
    { Day: 'All', Period: 'P6', Group: 'G3', CLASS_ROOM: '2.18', Teachers: 'Ashfaq M & Singh A', Topic: 'English Session' },
    { Day: 'All', Period: 'P6', Group: 'G4', CLASS_ROOM: '2.05', Teachers: 'Hussain A & Jawish A', Topic: 'English Session' },
    { Day: 'All', Period: 'P6', Group: 'G5', CLASS_ROOM: '2.02', Teachers: 'Eldaw A', Topic: 'English Session' },
    { Day: 'All', Period: 'P6', Group: 'G6', CLASS_ROOM: '2.01', Teachers: 'Khan N', Topic: 'English Session' },
    // P7 (2:45 - 3:40)
    { Day: 'All', Period: 'P7', Group: 'G2', CLASS_ROOM: '2.10', Teachers: 'El-Sayed H & Singh A', Topic: 'English Session' },
    { Day: 'All', Period: 'P7', Group: 'G3', CLASS_ROOM: '2.18', Teachers: 'Ashfaq M & Jawish A', Topic: 'English Session' },
    { Day: 'All', Period: 'P7', Group: 'G4', CLASS_ROOM: '2.05', Teachers: 'Hussain A', Topic: 'English Session' },
    { Day: 'All', Period: 'P7', Group: 'G5', CLASS_ROOM: '2.02', Teachers: 'Eldaw A', Topic: 'English Session' },
    { Day: 'All', Period: 'P7', Group: 'G6', CLASS_ROOM: '2.01', Teachers: 'Khan N', Topic: 'English Session' },
];


const processRawSchedule = (
    rawSchedule: any[], 
    weekType: 'odd' | 'even', 
    type: 'Technical' | 'English'
): Assignment[] => {
    const assignments: Assignment[] = [];
    let idCounter = (weekType === 'odd' ? 0 : 1000) + (type === 'Technical' ? 0 : 500);

    const days: Assignment['day'][] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

    rawSchedule.forEach(a => {
        const periods = a.Period.match(/\d+/g)?.map(Number) || [];
        const processDay = (day: Assignment['day']) => {
            if (periods.length > 0) {
                for (let i = periods[0]; i <= (periods[1] || periods[0]); i++) {
                    assignments.push({
                        id: idCounter++,
                        weekType,
                        day: day,
                        period: `P${i}` as Assignment['period'],
                        group: a.Group.split('(')[0].trim(),
                        classroom: a.CLASS_ROOM.split(' / ')[0].trim(),
                        instructors: (a.Trainer || a.Teachers).split('&').map((s: string) => s.trim()),
                        topic: a.Topic,
                        type,
                    });
                }
            }
        }
        
        if (days.includes(a.Day)) {
             processDay(a.Day);
        } else { // Handle templates that apply to all days
            days.forEach(day => processDay(day));
        }

    });

    return assignments;
};

// TEMPLATES for English Schedule (as they are consistent)
const createEnglishScheduleTemplate = (groups: string[], teachers: string[], weekType: 'odd' | 'even', isMorning: boolean): any[] => {
    const schedule = [];
    const periods = isMorning ? 'P 1 to 4' : 'P 5 to 7';
    
    for (let i = 0; i < groups.length; i++) {
        schedule.push({
            Day: 'All', // Template for all days
            Period: periods,
            Group: groups[i],
            CLASS_ROOM: (200 + i).toString(), // Placeholder
            Teachers: teachers[i % teachers.length],
            Topic: 'English Session',
        });
    }
    return schedule;
};

// Even Week English Groups
const evenWeekMorningEnglishGroups = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7'];
const evenWeekAfternoonEnglishGroups = ['G8', 'G9', 'G10', 'G11', 'G12', 'G13'];


const englishTeachers = allInstructors.english;

const rawEnglishScheduleEven = [
    ...createEnglishScheduleTemplate(evenWeekMorningEnglishGroups, englishTeachers, 'even', true),
    ...createEnglishScheduleTemplate(evenWeekAfternoonEnglishGroups, englishTeachers, 'even', false),
];

export const processedScheduleData: Assignment[] = [
    ...processRawSchedule(rawScheduleOdd, 'odd', 'Technical'),
    ...processRawSchedule(rawScheduleEven, 'even', 'Technical'),
    ...processRawSchedule(rawEnglishScheduleOdd_Week41, 'odd', 'English'),
    ...processRawSchedule(rawEnglishScheduleEven, 'even', 'English'),
];