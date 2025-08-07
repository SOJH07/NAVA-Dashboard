

import { useMemo } from 'react';
import type { EnhancedStudent } from '../types';
import { students, groupInfo, dailySchedule, floorPlanLayout } from '../data/academyData';
import { processedScheduleData } from '../data/scheduleData';
import { aptisScoresData } from '../data/aptisScores';

export const useDashboardData = () => {

  const enhancedStudents = useMemo<EnhancedStudent[]>(() => {
    return students.map(student => {
      const techInfo = groupInfo[student.techGroup];
      const englishInfo = groupInfo[student.englishGroup];
      const aptisScores = aptisScoresData[student.navaId];
      
      let englishCurriculumName = englishInfo?.curriculum_name || 'N/A';
      if(aptisScores) {
        const cefr = aptisScores.overall.cefr;
        if (cefr === 'A1' || cefr === 'A2') {
            englishCurriculumName = 'SEA';
        } else if (['B1', 'B2', 'C'].includes(cefr)) {
            englishCurriculumName = 'ESP-II';
        }
      }

      return {
        ...student,
        fullName: `${student.name} ${student.surname}`,
        trackName: techInfo?.track_name || 'N/A',
        techScheduleType: techInfo?.schedule_type || 'N/A',
        englishCurriculumName: englishCurriculumName,
        englishScheduleType: englishInfo?.schedule_type || 'N/A',
        aptisScores: aptisScores,
      };
    });
  }, []);

  const aptisSkillAverages = useMemo(() => {
    const studentsWithScores = Object.values(aptisScoresData);
    const count = studentsWithScores.length;

    if (count === 0) {
      return {
        grammarVocabulary: 0,
        listening: 0,
        reading: 0,
        speaking: 0,
        writing: 0,
      };
    }

    const scoreSums = studentsWithScores.reduce((acc, scores) => {
      acc.grammarVocabulary += scores.grammarVocabulary.score;
      acc.listening += scores.listening.score;
      acc.reading += scores.reading.score;
      acc.speaking += scores.speaking.score;
      acc.writing += scores.writing.score;
      return acc;
    }, { grammarVocabulary: 0, listening: 0, reading: 0, speaking: 0, writing: 0 });

    return {
      grammarVocabulary: scoreSums.grammarVocabulary / count,
      listening: scoreSums.listening / count,
      reading: scoreSums.reading / count,
      speaking: scoreSums.speaking / count,
      writing: scoreSums.writing / count,
    };
  }, []);

  const groupStudentCounts = useMemo(() => {
    const techCounts: Record<string, number> = {};
    const englishCounts: Record<string, number> = {};
    
    for (const student of students) {
        if (student.techGroup) {
            techCounts[student.techGroup] = (techCounts[student.techGroup] || 0) + 1;
        }
        if (student.englishGroup) {
            englishCounts[student.englishGroup] = (englishCounts[student.englishGroup] || 0) + 1;
        }
    }
    return { tech: techCounts, english: englishCounts };
  }, [students]);

  const groupCompanyMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const student of students) {
        if (student.techGroup) {
            if (!map[student.techGroup]) map[student.techGroup] = new Set();
            map[student.techGroup].add(student.company);
        }
        if (student.englishGroup) {
            if (!map[student.englishGroup]) map[student.englishGroup] = new Set();
            map[student.englishGroup].add(student.company);
        }
    }
    // Convert sets to arrays for easier use
    const finalMap: Record<string, string[]> = {};
    for(const group in map) {
        finalMap[group] = Array.from(map[group]);
    }
    return finalMap;
  }, [students]);

  const kpis = useMemo(() => {
    const totalStudents = enhancedStudents.length;
    const companies = new Set(enhancedStudents.map(s => s.company));
    return {
      totalStudents,
      companyCount: companies.size,
    };
  }, [enhancedStudents]);

  const chartsData = useMemo(() => {
    const companyDistribution = Array.from(
      enhancedStudents.reduce((acc, student) => {
        acc.set(student.company, (acc.get(student.company) || 0) + 1);
        return acc;
      }, new Map<string, number>()),
      ([name, value]) => ({ name, value })
    );

    const trackDistribution = Array.from(
      enhancedStudents.reduce((acc, student) => {
        if (student.trackName && student.trackName !== 'N/A') {
          acc.set(student.trackName, (acc.get(student.trackName) || 0) + 1);
        }
        return acc;
      }, new Map<string, number>()),
      ([name, value]) => ({ name, value })
    );

    return { companyDistribution, trackDistribution };
  }, [enhancedStudents]);

  const allFilterOptions = useMemo(() => {
    const techTracks: { [key: string]: string[] } = {};
    const englishGroupsByCurriculum: { [key: string]: Set<string> } = {};
    const allEnglishGroupsStatic = new Set<string>();

    enhancedStudents.forEach(student => {
      const { trackName, techGroup, englishCurriculumName, englishGroup } = student;
      if (trackName && techGroup && trackName !== 'N/A') {
          if (!techTracks[trackName]) techTracks[trackName] = [];
          if (!techTracks[trackName].includes(techGroup)) techTracks[trackName].push(techGroup);
      }
      if (englishCurriculumName && englishGroup && englishCurriculumName !== 'N/A') {
          if (!englishGroupsByCurriculum[englishCurriculumName]) englishGroupsByCurriculum[englishCurriculumName] = new Set();
          englishGroupsByCurriculum[englishCurriculumName].add(englishGroup);
      }
      if(englishGroup) allEnglishGroupsStatic.add(englishGroup);
    });

    for (const track in techTracks) {
        techTracks[track].sort();
    }
    
    const allAptisCEFRLevels = Array.from(new Set(Object.values(aptisScoresData).map(score => score.overall.cefr))).sort();


    return {
        allCompanies: Array.from(new Set(students.map(s => s.company))).sort(),
        allTechTracks: Object.keys(techTracks).sort(),
        allEnglishCurriculums: ['SEA', 'ESP-II'],
        allAptisCEFRLevels,
        allTechGroups: Object.values(techTracks).flat().sort(),
        allEnglishGroups: Array.from(allEnglishGroupsStatic).sort((a, b) => parseInt(a.substring(1)) - parseInt(b.substring(1))),
        allClassrooms: floorPlanLayout.filter(item => item.type === 'classroom' || item.type === 'lab').map(item => item.name).sort(),
    };
  }, [students, groupInfo, floorPlanLayout, enhancedStudents]);

  return {
    kpis,
    chartsData,
    enhancedStudents,
    dailySchedule,
    groupInfo,
    floorPlanLayout,
    groupStudentCounts,
    processedScheduleData,
    groupCompanyMap,
    allFilterOptions,
    aptisSkillAverages,
  };
};