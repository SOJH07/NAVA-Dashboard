import React, { useState, useMemo } from 'react';
import type { EnhancedStudent, LiveStudent, AptisScores, LiveOpsFilters } from '../types';

// Icons
const TechnicalProgramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
);
const EnglishProgramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"></circle>
        <path d="M20.2 20.2c2.04-2.03.02-7.5-6-11.5s-9.44-8.04-11.5-6c-2.04 2.03-.02 7.5 6 11.5s9.44 8.04 11.5 6z"></path>
        <path d="M3.8 20.2c-2.04-2.03-.02-7.5 6-11.5s9.44-8.04 11.5-6c2.04 2.03.02 7.5-6 11.5s-9.44 8.04-11.5 6z"></path>
    </svg>
);

type SkillKey = keyof Omit<AptisScores, 'overall'>;

const getPerformanceColors = (score: number) => {
    if (score >= 40) return {
        bar: 'bg-green-500', 
        text: 'text-green-600 font-bold',
        gradient: 'from-green-200/80 to-green-50/50'
    };
    if (score >= 30) return {
        bar: 'bg-yellow-400', 
        text: 'text-yellow-600 font-bold',
        gradient: 'from-yellow-200/80 to-yellow-50/50'
    };
    return { 
        bar: 'bg-red-500', 
        text: 'text-red-600 font-bold',
        gradient: 'from-red-200/80 to-red-50/50'
    };
};

const getCefrPillStyle = (cefr?: string) => {
    if (!cefr) return 'bg-slate-200 text-slate-800';
    if (cefr.startsWith('A')) return 'bg-red-100 text-red-800';
    if (cefr.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (cefr.startsWith('C')) return 'bg-green-100 text-green-800';
    return 'bg-slate-200 text-slate-800';
};


const AptisSkillBar: React.FC<{
    score: number;
    averageScore: number;
    maxScore?: number;
}> = ({ score, averageScore, maxScore = 50 }) => {
    
    const { bar: barColor } = getPerformanceColors(score);
    const scorePercent = (score / maxScore) * 100;
    const avgPercent = (averageScore / maxScore) * 100;

    const clampedScorePercent = Math.min(100, scorePercent);
    const clampedAvgPercent = Math.min(100, avgPercent);

    return (
        <div className="relative h-2.5 w-full rounded-full">
            {/* Base track */}
            <div className="absolute top-0 h-full w-full rounded-full bg-slate-200/70"></div>

            {/* Gradient from score to average (if score is lower) */}
            {clampedScorePercent < clampedAvgPercent && (
                <div 
                    className="absolute top-0 h-full bg-gradient-to-r from-amber-100 to-amber-50"
                    style={{
                        left: `${clampedScorePercent}%`,
                        width: `${clampedAvgPercent - clampedScorePercent}%`
                    }}
                ></div>
            )}
            
            {/* Gradient from average to end */}
             <div 
                className="absolute top-0 h-full rounded-r-full bg-gradient-to-r from-emerald-100 to-emerald-50/50"
                style={{
                    left: `${clampedAvgPercent}%`,
                    width: `${100 - clampedAvgPercent}%`
                }}
            ></div>

            {/* The actual score bar */}
            <div 
                className={`absolute top-0 h-full rounded-l-full ${barColor} ${clampedScorePercent >= 99.5 ? 'rounded-r-full' : ''}`} 
                style={{ width: `${clampedScorePercent}%` }}
            ></div>
            
            {/* Average Marker */}
            <div 
                className="absolute top-1/2 h-4 w-1 -translate-y-1/2 -translate-x-1/2 bg-slate-800 rounded-full z-10"
                style={{ left: `${clampedAvgPercent}%` }}
                title={`Academy Average: ${averageScore.toFixed(1)}`}
            >
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-0.5 text-xs font-semibold text-slate-600">{Math.round(averageScore)}</span>
            </div>
        </div>
    );
};

const SKILL_DATA: { key: SkillKey; label: string }[] = [
    { key: 'grammarVocabulary', label: 'Grammar & Vocab' },
    { key: 'listening', label: 'Listening' },
    { key: 'reading', label: 'Reading' },
    { key: 'speaking', label: 'Speaking' },
    { key: 'writing', label: 'Writing' },
];

const StudentProfileCard: React.FC<{
    student: EnhancedStudent;
    liveStudent: LiveStudent | undefined;
    aptisSkillAverages: { [key in SkillKey]: number };
}> = ({ student, liveStudent, aptisSkillAverages }) => {
    const overallCefr = student.aptisScores?.overall.cefr;
    const overallCefrPillStyle = getCefrPillStyle(overallCefr);
    
    const liveStatusTag = () => {
        if (liveStudent?.status === 'In Class' && liveStudent.location.includes('C-')) {
            const isTech = liveStudent.location.startsWith('Tech');
            const styles = isTech
                ? { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500' }
                : { bg: 'bg-teal-100', text: 'text-teal-700', dot: 'bg-teal-500' };

            return (
                <span className={`px-3 py-1 text-sm font-bold rounded-full flex items-center gap-2 ${styles.bg} ${styles.text}`}>
                    <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`}></span>
                    Live: {liveStudent.location.split(': C-')[1]}
                </span>
            );
        }
        return null;
    };


    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200/80 overflow-hidden">
            <div className="h-2.5 bg-brand-secondary" />

            {/* Header */}
            <div className="p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">{student.fullName}</h2>
                        <p className="text-base text-slate-500 font-mono mt-1">NAVA ID: {student.navaId}</p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-3">
                         <span className={`px-4 py-1 text-sm font-bold rounded-full text-white ${student.company === 'Ceer' ? 'bg-brand-ceer' : 'bg-brand-lucid'}`}>{student.company}</span>
                         {liveStatusTag()}
                    </div>
                </div>
            </div>

            {/* Body */}
             <div className="bg-slate-50/50 border-t border-slate-200/80">
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Technical Program */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-status-tech-light p-2 rounded-lg text-status-tech"><TechnicalProgramIcon /></div>
                            <h3 className="text-lg font-bold text-gray-800">Technical Program</h3>
                        </div>
                        <div className="space-y-3 text-base pl-4 border-l-2 border-slate-200 ml-3">
                            <div className="flex"><strong className="font-semibold text-slate-500 w-28 flex-shrink-0 text-sm">Track:</strong> <span className="text-gray-800 font-medium">{student.trackName}</span></div>
                            <div className="flex"><strong className="font-semibold text-slate-500 w-28 flex-shrink-0 text-sm">Group:</strong> <span className="text-gray-800 font-medium">{student.techGroup}</span></div>
                            <div className="flex"><strong className="font-semibold text-slate-500 w-28 flex-shrink-0 text-sm">Classroom:</strong> <span className="text-gray-800 font-medium">C-{student.techClass.replace('.', '')}</span></div>
                        </div>
                    </div>
                    {/* English Program */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-status-english-light p-2 rounded-lg text-status-english"><EnglishProgramIcon /></div>
                            <h3 className="text-lg font-bold text-gray-800">English Program</h3>
                        </div>
                        <div className="space-y-3 text-base pl-4 border-l-2 border-slate-200 ml-3">
                            <div className="flex"><strong className="font-semibold text-slate-500 w-28 flex-shrink-0 text-sm">Curriculum:</strong> <span className="text-gray-800 font-medium">{student.englishCurriculumName}</span></div>
                            <div className="flex"><strong className="font-semibold text-slate-500 w-28 flex-shrink-0 text-sm">Group:</strong> <span className="text-gray-800 font-medium">{student.englishGroup}</span></div>
                            <div className="flex"><strong className="font-semibold text-slate-500 w-28 flex-shrink-0 text-sm">Classroom:</strong> <span className="text-gray-800 font-medium">C-{student.englishClass.replace('.', '')}</span></div>
                        </div>
                    </div>
                </div>
            </div>


            {/* APTIS Scores */}
            {student.aptisScores ? (
                <div className="p-8 border-t border-slate-200/80">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">APTIS Performance Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        <div className="md:col-span-1 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-lg p-6 h-full">
                            <p className="text-sm font-semibold text-text-secondary">Overall Score</p>
                            <p className="text-7xl font-extrabold text-brand-secondary my-1">{student.aptisScores.overall.score}</p>
                            <span className={`px-4 py-1 text-base font-bold rounded-full ${overallCefrPillStyle}`}>{student.aptisScores.overall.cefr}</span>
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                             {SKILL_DATA.map(({ key, label }) => {
                                const scoreData = student.aptisScores![key];
                                const score = scoreData.score;
                                const { text: textColor } = getPerformanceColors(score);

                                return (
                                    <div key={key}>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <p className="text-base font-semibold text-text-secondary">
                                                {label}
                                            </p>
                                            <p className={`text-xl ${textColor}`}>
                                                {score}
                                                <span className="text-sm font-medium text-text-muted"> / 50</span>
                                            </p>
                                        </div>
                                        <AptisSkillBar 
                                            score={score} 
                                            averageScore={aptisSkillAverages[key]}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-6 text-center text-text-muted border-t border-slate-200/80">
                    <p>APTIS Scores not available for this student.</p>
                </div>
            )}
        </div>
    );
};

interface StudentFinderPageProps {
    enhancedStudents: EnhancedStudent[];
    liveStudents: LiveStudent[];
    globalSearchTerm: string;
    aptisSkillAverages: { [key in SkillKey]: number } | null;
    filters: LiveOpsFilters;
}

const StudentFinderPage: React.FC<StudentFinderPageProps> = ({ enhancedStudents, liveStudents, globalSearchTerm, aptisSkillAverages, filters }) => {
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    
    const hasActiveFilters = useMemo(() => {
        return (
            filters.companies.length > 0 ||
            filters.techTracks.length > 0 ||
            filters.englishCurriculums.length > 0 ||
            filters.aptisCEFRLevels.length > 0 ||
            filters.techGroups.length > 0 ||
            filters.englishGroups.length > 0 ||
            filters.classrooms.length > 0
        );
    }, [filters]);

    const searchResults = useMemo(() => {
        const lowercasedSearch = globalSearchTerm.toLowerCase().trim();
        
        if (!lowercasedSearch && !hasActiveFilters) {
            return [];
        }

        let studentsToProcess = enhancedStudents;
        
        // Apply global filters
        if (filters.companies.length > 0) studentsToProcess = studentsToProcess.filter(s => filters.companies.includes(s.company));
        if (filters.techTracks.length > 0) studentsToProcess = studentsToProcess.filter(s => filters.techTracks.includes(s.trackName));
        if (filters.englishCurriculums.length > 0) studentsToProcess = studentsToProcess.filter(s => filters.englishCurriculums.includes(s.englishCurriculumName));
        if (filters.aptisCEFRLevels.length > 0) studentsToProcess = studentsToProcess.filter(s => s.aptisScores && filters.aptisCEFRLevels.includes(s.aptisScores.overall.cefr));
        if (filters.techGroups.length > 0) studentsToProcess = studentsToProcess.filter(s => filters.techGroups.includes(s.techGroup));
        if (filters.englishGroups.length > 0) studentsToProcess = studentsToProcess.filter(s => filters.englishGroups.includes(s.englishGroup));
        if (filters.classrooms.length > 0) {
            studentsToProcess = studentsToProcess.filter(s => {
                const techClassFormatted = `C-${s.techClass.replace('.', '')}`;
                const englishClassFormatted = `C-${s.englishClass.replace('.', '')}`;
                return filters.classrooms.includes(techClassFormatted) || filters.classrooms.includes(englishClassFormatted);
            });
        }
        
        if (lowercasedSearch) {
            return studentsToProcess.filter(student =>
                student.fullName.toLowerCase().includes(lowercasedSearch) ||
                String(student.navaId).includes(lowercasedSearch) ||
                student.techGroup.toLowerCase().includes(lowercasedSearch) ||
                student.englishGroup.toLowerCase().includes(lowercasedSearch)
            );
        }

        return studentsToProcess;
    }, [globalSearchTerm, enhancedStudents, filters, hasActiveFilters]);

    const selectedStudent = useMemo(() => {
        if (!selectedStudentId) return null;
        const student = enhancedStudents.find(s => s.navaId === selectedStudentId);
        if(!student) {
            setSelectedStudentId(null);
            return null;
        }
        return student;
    }, [selectedStudentId, enhancedStudents]);

    const selectedLiveStudent = useMemo(() => {
        if (!selectedStudentId) return undefined;
        return liveStudents.find(s => s.navaId === selectedStudentId);
    }, [selectedStudentId, liveStudents]);
    
    React.useEffect(() => {
        if (searchResults.length === 1) {
            setSelectedStudentId(searchResults[0].navaId);
        } else {
            if(selectedStudentId && !searchResults.some(s => s.navaId === selectedStudentId)){
                setSelectedStudentId(null);
            }
        }
    }, [searchResults, selectedStudentId]);

    const renderContent = () => {
        if (selectedStudent) {
            return (
                <div className="w-full max-w-5xl mx-auto">
                     <button 
                        onClick={() => setSelectedStudentId(null)} 
                        className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Search Results
                    </button>
                    { aptisSkillAverages ? (
                        <StudentProfileCard 
                            student={selectedStudent} 
                            liveStudent={selectedLiveStudent} 
                            aptisSkillAverages={aptisSkillAverages} 
                        />
                    ) : (
                        <div className="p-6 text-center text-text-muted border border-slate-200/80 rounded-xl bg-white">
                            <p>APTIS Analytics data is currently unavailable.</p>
                        </div>
                    )}
                </div>
            );
        }

        if (!hasActiveFilters && !globalSearchTerm.trim()) {
            return (
                <div className="text-center text-text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-20 w-20 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm-9 5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <h2 className="mt-4 text-2xl font-bold text-text-primary">Find a Student</h2>
                    <p className="mt-1 text-lg">Use the search bar or the global filter panel to find students.</p>
                </div>
            );
        }

        if (searchResults.length > 0) {
            return (
                <div className="w-full max-w-4xl mx-auto">
                    <h3 className="text-lg font-bold text-text-primary mb-4">Search Results ({searchResults.length})</h3>
                    <ul className="space-y-3">
                        {searchResults.map(student => (
                            <li key={student.navaId}>
                                <button
                                    onClick={() => setSelectedStudentId(student.navaId)}
                                    className="w-full text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-slate-50 transition-all flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-bold text-text-primary">{student.fullName}</p>
                                        <p className="text-sm text-text-muted font-mono">{student.navaId}</p>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full text-white ${student.company === 'Ceer' ? 'bg-brand-ceer' : 'bg-brand-lucid'}`}>{student.company}</span>
                                        <span className="text-text-secondary"><strong className="font-semibold">Tech:</strong> {student.techGroup}</span>
                                        <span className="text-text-secondary"><strong className="font-semibold">Eng:</strong> {student.englishGroup}</span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }

        return (
            <div className="text-center text-text-muted">
                 <h2 className="mt-4 text-2xl font-bold text-text-primary">No Students Found</h2>
                 <p className="mt-1 text-lg">Your search and filter criteria did not match any students.</p>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col items-center justify-start p-4 overflow-y-auto">
            {renderContent()}
        </div>
    );
};

export default StudentFinderPage;