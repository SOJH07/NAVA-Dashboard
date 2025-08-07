
import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ScatterChart, Scatter, ZAxis, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import type { EnhancedStudent, LiveOpsFilters, AptisScores } from '../types';
import { useDashboardData } from '../hooks/useDashboardData';
import ChartContainer from '../components/ChartContainer';
import KpiSummaryPanel from '../components/KpiSummaryPanel';

const COMPANY_COLORS: { [key: string]: string } = {
    'Ceer': '#4f46e5',
    'Lucid': '#0d9488',
};

const RADAR_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

interface AnalyticsPageProps {
  students: EnhancedStudent[];
  allFilterOptions: ReturnType<typeof useDashboardData>['allFilterOptions'];
  filters: LiveOpsFilters;
  globalSearchTerm: string;
  toggleArrayFilter: (filterType: 'companies' | 'techTracks' | 'englishCurriculums' | 'techGroups' | 'englishGroups' | 'classrooms' | 'aptisCEFRLevels', value: string) => void;
}

const getCefrColor = (cefr: string) => {
    if (cefr.startsWith('A')) return '#ef4444'; // red-500
    if (cefr.startsWith('B')) return '#3b82f6'; // blue-500
    if (cefr.startsWith('C')) return '#22c55e'; // green-500
    return '#6b7280'; // gray-500
};

const StudentWatchList: React.FC<{title: string, students: EnhancedStudent[], colorClass: string}> = ({title, students, colorClass}) => (
    <div className="bg-bg-panel border border-slate-200 rounded-lg shadow-sm p-4 h-full">
        <h4 className={`font-bold text-lg mb-3 pb-2 border-b-2 ${colorClass}`}>{title}</h4>
        {students.length === 0 ? <p className="text-sm text-text-muted">No students in this category.</p> :
        <ul className="space-y-2">
            {students.map(s => (
                <li key={s.navaId} className="flex justify-between items-center text-sm p-1.5 rounded-md hover:bg-slate-100">
                    <span className="font-semibold text-text-primary">{s.fullName}</span>
                    <span className="font-mono text-xs font-bold text-white bg-slate-600 px-2 py-0.5 rounded-full">{s.aptisScores?.overall.score}</span>
                </li>
            ))}
        </ul>
        }
    </div>
);


const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ students, allFilterOptions, filters, globalSearchTerm, toggleArrayFilter }) => {
  const [radarChartCategory, setRadarChartCategory] = useState<'company' | 'englishCurriculum' | 'techTrack'>('company');
  const { allCompanies, allTechTracks, allEnglishCurriculums } = allFilterOptions;

  const filteredStudents = useMemo(() => {
    let studentsToFilter = students;
    
    if (filters.companies.length > 0) studentsToFilter = studentsToFilter.filter(s => filters.companies.includes(s.company));
    if (filters.techTracks.length > 0) studentsToFilter = studentsToFilter.filter(s => filters.techTracks.includes(s.trackName));
    if (filters.englishCurriculums.length > 0) studentsToFilter = studentsToFilter.filter(s => filters.englishCurriculums.includes(s.englishCurriculumName));
    if (filters.aptisCEFRLevels.length > 0) studentsToFilter = studentsToFilter.filter(s => s.aptisScores && filters.aptisCEFRLevels.includes(s.aptisScores.overall.cefr));
    if (filters.techGroups.length > 0) studentsToFilter = studentsToFilter.filter(s => filters.techGroups.includes(s.techGroup));
    if (filters.englishGroups.length > 0) studentsToFilter = studentsToFilter.filter(s => filters.englishGroups.includes(s.englishGroup));
    
    if (globalSearchTerm) {
        const lowercasedFilter = globalSearchTerm.toLowerCase();
        studentsToFilter = studentsToFilter.filter(student =>
          student.fullName.toLowerCase().includes(lowercasedFilter) ||
          String(student.navaId).includes(lowercasedFilter) ||
          student.techGroup.toLowerCase().includes(lowercasedFilter) ||
          student.englishGroup.toLowerCase().includes(lowercasedFilter)
        );
    }

    return studentsToFilter;
  }, [students, filters, globalSearchTerm]);
  
  const { chartsData, studentLists } = useMemo(() => {
    const studentsWithScores = filteredStudents.filter((s): s is EnhancedStudent & { aptisScores: AptisScores } => !!s.aptisScores);
    
    const cefrDistribution = allFilterOptions.allAptisCEFRLevels.map(level => ({
        name: level,
        count: studentsWithScores.filter(s => s.aptisScores.overall.cefr === level).length
    })).filter(item => item.count > 0);

    const performanceByCompany = allCompanies.map(company => {
        const companyStudents = studentsWithScores.filter(s => s.company === company);
        return { 
            name: company, 
            'SEA (Development)': companyStudents.filter(s => s.englishCurriculumName === 'SEA').length,
            'ESP-II (Proficient)': companyStudents.filter(s => s.englishCurriculumName === 'ESP-II').length,
        };
    });
    
    const overallScores = studentsWithScores.map(s => s.aptisScores.overall.score);
    const scoreDistributionData = (scores: number[]) => {
        if (scores.length === 0) return [];
        const minScore = Math.min(...scores);
        const maxScore = Math.max(...scores);
        const binSize = 10;
        const bins: { [key: string]: number } = {};

        // Initialize bins from the lowest score boundary to the highest
        for (let i = Math.floor(minScore / binSize) * binSize; i <= maxScore; i += binSize) {
            const binName = `${i}-${i + binSize - 1}`;
            bins[binName] = 0;
        }

        scores.forEach(score => {
            const binStart = Math.floor(score / binSize) * binSize;
            const binName = `${binStart}-${binStart + binSize - 1}`;
            if (bins[binName] !== undefined) {
                bins[binName]++;
            }
        });

        return Object.entries(bins).map(([name, count]) => ({ name, students: count }));
    };
    const overallScoreDistribution = scoreDistributionData(overallScores);

    const calculateAverageScores = (studentSet: (EnhancedStudent & { aptisScores: AptisScores })[]) => {
        const studentCount = studentSet.length;
        if (studentCount === 0) return { grammarVocabulary: 0, listening: 0, reading: 0, speaking: 0, writing: 0 };
    
        const initialScores = { grammarVocabulary: 0, listening: 0, reading: 0, speaking: 0, writing: 0 };
        const scoreSums = studentSet.reduce((acc, student) => {
            acc.grammarVocabulary += student.aptisScores.grammarVocabulary.score;
            acc.listening += student.aptisScores.listening.score;
            acc.reading += student.aptisScores.reading.score;
            acc.speaking += student.aptisScores.speaking.score;
            acc.writing += student.aptisScores.writing.score;
            return acc;
        }, initialScores);
    
        return {
            grammarVocabulary: scoreSums.grammarVocabulary / studentCount,
            listening: scoreSums.listening / studentCount,
            reading: scoreSums.reading / studentCount,
            speaking: scoreSums.speaking / studentCount,
            writing: scoreSums.writing / studentCount,
        };
    };
    
    const radarSubjects = [
        { name: 'G&V', key: 'grammarVocabulary' }, { name: 'Listen', key: 'listening' },
        { name: 'Read', key: 'reading' }, { name: 'Speak', key: 'speaking' }, { name: 'Write', key: 'writing' },
    ];

    const categoryMap: { [key: string]: { name: string, data: string[] } } = { 
        company: { name: 'by Company', data: allCompanies }, 
        englishCurriculum: { name: 'by Curriculum', data: allEnglishCurriculums }, 
        techTrack: { name: 'by Tech Track', data: allTechTracks } 
    };
    const radarCategories = categoryMap[radarChartCategory].data;
    const averageScoresByCategory = radarCategories.reduce((acc, category) => {
        let studentsInCategory;
        switch (radarChartCategory) {
            case 'company': studentsInCategory = studentsWithScores.filter(s => s.company === category); break;
            case 'englishCurriculum': studentsInCategory = studentsWithScores.filter(s => s.englishCurriculumName === category); break;
            case 'techTrack': studentsInCategory = studentsWithScores.filter(s => s.trackName === category); break;
            default: studentsInCategory = [];
        }
        acc[category] = calculateAverageScores(studentsInCategory);
        return acc;
    }, {} as { [key: string]: { [key: string]: number } });

    const radarData = radarSubjects.map(subject => {
        const dataPoint: { [key: string]: string | number } = { subject: subject.name };
        radarCategories.forEach(category => { dataPoint[category] = parseFloat(averageScoresByCategory[category][subject.key].toFixed(1)); });
        return dataPoint;
    });

    const sortedStudents = [...studentsWithScores].sort((a, b) => b.aptisScores.overall.score - a.aptisScores.overall.score);
    const topPerformers = sortedStudents.slice(0, 5);
    const needsSupport = sortedStudents.slice(-5).reverse();

    return {
        chartsData: { cefrDistribution, performanceByCompany, overallScoreDistribution, radarData, radarCategories, radarCategoryLabel: categoryMap[radarChartCategory].name },
        studentLists: { topPerformers, needsSupport }
    };
  }, [filteredStudents, allCompanies, allTechTracks, allEnglishCurriculums, radarChartCategory, allFilterOptions.allAptisCEFRLevels]);

  return (
    <div className="space-y-6">
        <KpiSummaryPanel students={filteredStudents} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer title="Student CEFR Level Distribution">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartsData.cefrDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} layout="vertical">
                        <XAxis type="number" stroke="#6b7280" fontSize={12} />
                        <YAxis type="category" dataKey="name" stroke="#6b7280" fontSize={12} width={40} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} wrapperStyle={{ outline: "none" }} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem' }} />
                        <Bar dataKey="count" name="Students" radius={[0, 4, 4, 0]}>
                            {chartsData.cefrDistribution.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={getCefrColor(entry.name)} style={{cursor: 'pointer', transition: 'opacity 0.2s'}} opacity={filters.aptisCEFRLevels.length === 0 || filters.aptisCEFRLevels.includes(entry.name) ? 1 : 0.3} onClick={() => toggleArrayFilter('aptisCEFRLevels', entry.name)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer title="English Curriculum Performance by Company">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartsData.performanceByCompany} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} wrapperStyle={{ outline: "none" }} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem' }} />
                        <Legend wrapperStyle={{fontSize: "12px"}} />
                        <Bar dataKey="SEA (Development)" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="ESP-II (Proficient)" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
            
             <ChartContainer 
                title="Core Skills Analysis"
                headerContent={
                    <select value={radarChartCategory} onChange={e => setRadarChartCategory(e.target.value as any)} className="text-sm font-semibold border border-slate-300 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-brand-primary">
                        <option value="company">by Company</option>
                        <option value="englishCurriculum">by Curriculum</option>
                        <option value="techTrack">by Tech Track</option>
                    </select>
                }
            >
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartsData.radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" fontSize={12} />
                        <PolarRadiusAxis angle={30} domain={[0, 50]} />
                        <Tooltip wrapperStyle={{ outline: "none" }} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem' }} />
                        <Legend wrapperStyle={{fontSize: "12px"}} />
                        {chartsData.radarCategories.map((category, i) => (
                           <Radar key={category} name={category} dataKey={category} stroke={RADAR_COLORS[i % RADAR_COLORS.length]} fill={RADAR_COLORS[i % RADAR_COLORS.length]} fillOpacity={0.6} />
                        ))}
                    </RadarChart>
                </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer title="Distribution of Overall Aptis Scores">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartsData.overallScoreDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="name" name="Overall Score Range" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis name="Number of Students" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} wrapperStyle={{ outline: "none" }} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem' }} />
                        <Bar dataKey="students" name="Students" fill="#0d9488" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StudentWatchList title="Top 5 Performers" students={studentLists.topPerformers} colorClass="border-green-500 text-green-600" />
            <StudentWatchList title="Top 5 Needing Support" students={studentLists.needsSupport} colorClass="border-red-500 text-red-600" />
        </div>
    </div>
  );
};

export default AnalyticsPage;
