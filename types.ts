

import type { ReactNode } from 'react';

export interface Student {
  navaId: number;
  name: string;
  surname: string;
  techGroup: string;
  techClass: string;
  englishGroup: string;
  englishClass: string;
  company: 'Ceer' | 'Lucid';
}

export interface DailyPeriod {
  name: string;
  start: string;
  end: string;
  type: 'class' | 'break';
}

export interface AptisScoreDetail {
  score: number;
  cefr: string;
}

export interface AptisScores {
  grammarVocabulary: AptisScoreDetail;
  listening: AptisScoreDetail;
  reading: AptisScoreDetail;
  speaking: AptisScoreDetail;
  writing: AptisScoreDetail;
  overall: AptisScoreDetail;
}


export interface GroupInfo {
  [key:string]: {
    schedule_type: string;
    curriculum_name: string;
    track_name: string;
  };
}

export interface FloorPlanItem {
  name: string;
  type: 'classroom' | 'static' | 'lab';
  gridColumn: string;
  gridRow: string;
}

export interface Page {
    id: string;
    label: string;
    icon: ReactNode;
}

export interface EnhancedStudent extends Student {
  fullName: string;
  trackName: string;
  techScheduleType: string;
  englishCurriculumName: string;
  englishScheduleType: string;
  aptisScores?: AptisScores;
}

export interface LiveStudent extends EnhancedStudent {
  location: string;
  status: 'In Class' | 'Break' | 'Finished' | 'Upcoming';
  currentPeriod: string;
}

export interface OccupancyData {
    [key: string]: {
        group: string;
        type: 'tech' | 'english';
    } | undefined
}

export interface LiveClass {
    group: string;
    type: 'tech' | 'english';
    classroom: string;
}

export interface GroupSchedule {
    group_name: string;
    schedule_type: string;
}

export interface Curriculum {
    group_name: string;
    curriculum_name: string;
    track_name: string;
}

export type ClassroomStatusType = 'available' | 'occupied' | 'out-of-service';

export interface ClassroomStatus {
    status: ClassroomStatusType;
    reason?: string;
}

export interface ClassroomState {
    [classroomName: string]: ClassroomStatus;
}

export interface CalendarEvent {
  event: string;
  start: string;
  end: string;
  type: 'CH' | 'NAVA' | 'National' | 'Ramadan' | 'Eid' | 'Annual' | 'Instructor' | 'Facility';
  color: string;
  category?: string;
}

export interface CalendarLayer {
  id: string;
  label: string;
  color: string;
}

export interface ProcessedCalendarEvent extends CalendarEvent {
  id: string; // Unique ID for key and hover state
  left: number;
  width: number;
  top: number;
  isMilestone: boolean;
  isInProgress: boolean;
  duration: number; // in days
}

export interface ProcessedGridEvent extends CalendarEvent {
  id: string; // Unique ID for key
  lane: number; // Vertical stacking lane
  startCol: number; // Grid column start (1-7)
  span: number; // How many columns it spans
  startsInWeek: boolean; // For rounded corners
  endsInWeek: boolean; // For rounded corners
}

export interface Assignment {
  id: number;
  weekType: 'odd' | 'even';
  day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
  period: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7';
  group: string;
  classroom: string;
  instructors: string[];
  topic: string;
  type: 'Technical' | 'English';
}

export type LiveOpsFilters = {
    status: 'all' | 'live' | 'not-live';
    session: 'all' | 'morning' | 'afternoon';
    sessionType: 'all' | 'tech' | 'english';
    techGroups: string[];
    englishGroups: string[];
    classrooms: string[];
    companies: string[];
    techTracks: string[];
    englishCurriculums: string[];
    aptisCEFRLevels: string[];
};
