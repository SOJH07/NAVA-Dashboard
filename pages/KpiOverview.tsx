
import React, { useState, useMemo, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import SelectionSummary from '../components/SelectionSummary';
import AcademyTotals from '../components/AcademyTotals';
import type { LiveStudent, DailyPeriod, EnhancedStudent, LiveOpsFilters } from '../types';
import { useLiveStatus } from '../hooks/useLiveStatus';
import { useDashboardData } from '../hooks/useDashboardData';

interface KpiOverviewProps {
  allStudents: EnhancedStudent[];
  students: LiveStudent[];
  allFilterOptions: ReturnType<typeof useDashboardData>['allFilterOptions'];
  liveStatusData: ReturnType<typeof useLiveStatus>;
  filters: LiveOpsFilters;
  globalSearchTerm: string;
  setFilters: React.Dispatch<React.SetStateAction<LiveOpsFilters>>;
  toggleArrayFilter: (filterType: 'companies' | 'techTracks' | 'englishCurriculums' | 'techGroups' | 'englishGroups' | 'classrooms' | 'aptisCEFRLevels', value: string) => void;
  clearFilters: () => void;
}

const COMPANY_COLORS: { [key: string]: string } = {
    'Ceer': '#4f46e5',
    'Lucid': '#0d9488',
};

const TECH_COLOR = '#e11d48';
const ENGLISH_COLOR = '#0ea5e9';


const ChartContainer: React.FC<{ title: string; children: React.ReactNode; className?: string}> = ({ title, children, className }) => (
    <div className={`bg-bg-panel border border-slate-200 p-6 rounded-lg shadow-sm h-full flex flex-col ${className}`}>
      <h3 className="text-xl font-semibold text-text-primary mb-4">{title}</h3>
      <div className="flex-grow w-full h-80">
        {children}
      </div>
    </div>
);

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            isActive
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-text-muted hover:text-text-primary hover:border-slate-300'
        }`}
    >
        {label}
    </button>
);


const KpiOverviewPage: React.FC<KpiOverviewProps> = ({ allStudents, students, allFilterOptions, liveStatusData, filters, globalSearchTerm, setFilters, toggleArrayFilter, clearFilters }) => {
  const [activeChartTab, setActiveChartTab] = useState<'overall' | 'tech' | 'english'>('overall');
  
  const { isEvenWeek, overallStatus } = liveStatusData;
  const { allCompanies, allTechTracks, allEnglishCurriculums, allTechGroups, allEnglishGroups } = allFilterOptions;


  const filteredStudents = useMemo(() => {
    let studentsToFilter = students;
    
    if (filters.companies.length > 0) studentsToFilter = studentsToFilter.filter(s => filters.companies.includes(s.company));
    if (filters.techTracks.length > 0) studentsToFilter = studentsToFilter.filter(s => filters.techTracks.includes(s.trackName));
    if (filters.englishCurriculums.length > 0) studentsToFilter = studentsToFilter.filter(s => filters.englishCurriculums.includes(s.englishCurriculumName));
    if (filters.aptisCEFRLevels.length > 0) studentsToFilter = studentsToFilter.filter(s => s.aptisScores && filters.aptisCEFRLevels.includes(s.aptisScores.overall.cefr));
    if (filters.techGroups.length > 0) studentsToFilter = studentsToFilter.filter(s => filters.techGroups.includes(s.techGroup));
    if (filters.englishGroups.length > 0) studentsToFilter = studentsToFilter.filter(s => filters.englishGroups.includes(s.englishGroup));
    
    if (filters.sessionType !== 'all') {
         studentsToFilter = studentsToFilter.filter(s => 
            (s.status === 'In Class' && 
                ((filters.sessionType === 'tech' && s.location.startsWith('Tech')) || 
                (filters.sessionType === 'english' && s.location.startsWith('English')))
            )
        );
    }

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
  
  const chartsData = useMemo(() => {
    
    const companyDistribution = allCompanies.map(company => ({ name: company, value: filteredStudents.filter(s => s.company === company).length }));
    const trackDistribution = allTechTracks.map(trackName => ({ name: trackName, value: filteredStudents.filter(s => s.trackName === trackName).length }));
    const englishCurriculumDistribution = allEnglishCurriculums.map(curriculum => ({ name: curriculum, value: filteredStudents.filter(s => s.englishCurriculumName === curriculum).length }));
    const companyByTrackDistribution = allTechTracks.map(trackName => {
        const trackData: {[key: string]: string | number} = { name: trackName };
        allCompanies.forEach(company => {
            trackData[company] = filteredStudents.filter(s => s.trackName === trackName && s.company === company).length;
        });
        return trackData;
    });
    const techGroupDistribution = allTechGroups.map(group => ({ name: group, value: filteredStudents.filter(s => s.techGroup === group).length })).filter(g => g.value > 0);
    const englishGroupDistribution = allEnglishGroups.map(group => ({ name: group, value: filteredStudents.filter(s => s.englishGroup === group).length })).filter(g => g.value > 0);

    return {
        companyDistribution,
        trackDistribution,
        englishCurriculumDistribution,
        companyByTrackDistribution,
        techGroupDistribution,
        englishGroupDistribution
    };
  }, [filteredStudents, allCompanies, allTechTracks, allEnglishCurriculums, allTechGroups, allEnglishGroups]);

  const statusPill = (status: LiveStudent['status']) => {
    const STATUS_COLORS: { [key: string]: { light: string, text: string } } = {
        'In Class': { light: 'bg-status-english-light', text: 'text-status-english'},
        'Break': { light: 'bg-status-break-light', text: 'text-status-break'},
        'Finished': { light: 'bg-status-out-of-service-light', text: 'text-status-out-of-service'},
        'Upcoming': { light: 'bg-status-upcoming-light', text: 'text-status-upcoming'},
    };
    const colors = STATUS_COLORS[status] || { light: 'bg-gray-100', text: 'text-gray-800' };
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full inline-block ${colors.light} ${colors.text}`}>
        {status}
      </span>
    );
  };
  
  const companyPill = (company: 'Ceer' | 'Lucid') => {
    const colors = { 'Ceer': 'bg-indigo-100 text-indigo-800', 'Lucid': 'bg-teal-100 text-teal-800' };
     return ( <span className={`px-2 py-0.5 text-xs font-medium rounded-full inline-block ${colors[company]}`}>{company}</span> );
  };

  const cefrPill = (cefr?: string) => {
    if (!cefr) return null;
    let colorClass = 'bg-slate-200 text-slate-800';
    if (cefr.startsWith('A')) colorClass = 'bg-red-100 text-red-800';
    else if (cefr.startsWith('B')) colorClass = 'bg-blue-100 text-blue-800';
    else if (cefr.startsWith('C')) colorClass = 'bg-green-100 text-green-800';
    return <span className={`w-10 text-center px-2 py-0.5 text-xs font-bold rounded-full inline-block ${colorClass}`}>{cefr}</span>;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 items-start">
        {/* Left Column: Summary Cards */}
        <div className="xl:col-span-3 xl:sticky xl:top-6 space-y-6">
             <AcademyTotals students={allStudents} />
             <SelectionSummary students={filteredStudents as LiveStudent[]} />
        </div>
        
        {/* Right Column: Data Exploration */}
        <div className="xl:col-span-7 space-y-6">
            <div className="bg-bg-panel border border-slate-200 rounded-lg shadow-sm">
                <div className="flex border-b border-slate-200">
                    <TabButton label="Overall View" isActive={activeChartTab === 'overall'} onClick={() => setActiveChartTab('overall')} />
                    <TabButton label="Technical View" isActive={activeChartTab === 'tech'} onClick={() => setActiveChartTab('tech')} />
                    <TabButton label="English View" isActive={activeChartTab === 'english'} onClick={() => setActiveChartTab('english')} />
                </div>
                <div className="p-4">
                    {activeChartTab === 'overall' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                             <ChartContainer title="Student Distribution by Company">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                    <Pie data={chartsData.companyDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                        {chartsData.companyDistribution.map((entry) => (
                                        <Cell key={`cell-${entry.name}`} fill={COMPANY_COLORS[entry.name]} style={{cursor: 'pointer', transition: 'opacity 0.2s'}} opacity={filters.companies.length === 0 || filters.companies.includes(entry.name) ? 1 : 0.3} onClick={() => toggleArrayFilter('companies', entry.name)}/>
                                        ))}
                                    </Pie>
                                    <Tooltip wrapperStyle={{ outline: "none" }} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem' }}/>
                                    <Legend onClick={(data) => toggleArrayFilter('companies', data.value)} style={{cursor: 'pointer'}}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                             <ChartContainer title="Company Distribution by Tech Track">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartsData.companyByTrackDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <XAxis dataKey="name" stroke={'#4b5563'} fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke={'#4b5563'} fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} wrapperStyle={{ outline: "none" }} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem' }}/>
                                        <Legend />
                                        {allCompanies.map(company => (
                                            <Bar key={company} dataKey={company} stackId="a" fill={COMPANY_COLORS[company]} radius={[4, 4, 0, 0]} style={{cursor: 'pointer', transition: 'opacity 0.2s'}} opacity={filters.companies.length === 0 || filters.companies.includes(company) ? 1 : 0.3} onClick={() => toggleArrayFilter('companies', company)}/>
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    )}
                     {activeChartTab === 'tech' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <ChartContainer title="Student Count by Technical Track">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartsData.trackDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <XAxis dataKey="name" stroke={'#4b5563'} fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke={'#4b5563'} fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} wrapperStyle={{ outline: "none" }} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem' }}/>
                                    <Bar dataKey="value" name="Students" fill={TECH_COLOR} radius={[4, 4, 0, 0]}>
                                        {chartsData.trackDistribution.map((entry) => (
                                            <Cell key={`cell-${entry.name}`} style={{cursor: 'pointer', transition: 'opacity 0.2s'}} opacity={filters.techTracks.length === 0 || filters.techTracks.includes(entry.name) ? 1 : 0.3} onClick={() => toggleArrayFilter('techTracks', entry.name)}/>
                                        ))}
                                    </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                            <ChartContainer title="Student Count by Technical Group">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartsData.techGroupDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <XAxis dataKey="name" stroke={'#4b5563'} fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke={'#4b5563'} fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} wrapperStyle={{ outline: "none" }} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem' }}/>
                                        <Bar dataKey="value" name="Students" fill={TECH_COLOR} radius={[4, 4, 0, 0]}>
                                            {chartsData.techGroupDistribution.map((entry) => (
                                                <Cell key={`cell-${entry.name}`} style={{cursor: 'pointer', transition: 'opacity 0.2s'}} opacity={filters.techGroups.length === 0 || filters.techGroups.includes(entry.name) ? 1 : 0.3} onClick={() => toggleArrayFilter('techGroups', entry.name)}/>
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    )}
                    {activeChartTab === 'english' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <ChartContainer title="Student Count by English Curriculum">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartsData.englishCurriculumDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <XAxis dataKey="name" stroke={'#4b5563'} fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke={'#4b5563'} fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} wrapperStyle={{ outline: "none" }} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem' }}/>
                                    <Bar dataKey="value" name="Students" fill={ENGLISH_COLOR} radius={[4, 4, 0, 0]}>
                                        {chartsData.englishCurriculumDistribution.map((entry) => (
                                            <Cell key={`cell-${entry.name}`} style={{cursor: 'pointer', transition: 'opacity 0.2s'}} opacity={filters.englishCurriculums.length === 0 || filters.englishCurriculums.includes(entry.name) ? 1 : 0.3} onClick={() => toggleArrayFilter('englishCurriculums', entry.name)}/>
                                        ))}
                                    </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                             <ChartContainer title="Student Count by English Group">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartsData.englishGroupDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <XAxis dataKey="name" stroke={'#4b5563'} fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke={'#4b5563'} fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} wrapperStyle={{ outline: "none" }} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem' }}/>
                                    <Bar dataKey="value" name="Students" fill={ENGLISH_COLOR} radius={[4, 4, 0, 0]}>
                                        {chartsData.englishGroupDistribution.map((entry) => (
                                            <Cell key={`cell-${entry.name}`} style={{cursor: 'pointer', transition: 'opacity 0.2s'}} opacity={filters.englishGroups.length === 0 || filters.englishGroups.includes(entry.name) ? 1 : 0.3} onClick={() => toggleArrayFilter('englishGroups', entry.name)}/>
                                        ))}
                                    </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    )}
                </div>
            </div>

            {/* Student Roster */}
            <div className="bg-bg-panel border border-slate-200 rounded-lg shadow-sm">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-text-primary">Filtered Student Roster ({filteredStudents.length})</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-text-secondary uppercase bg-slate-50">
                            <tr>
                                <th className="p-4">NAVA ID</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Company</th>
                                <th className="p-4">Tech Group</th>
                                <th className="p-4">English Group</th>
                                <th className="p-4">CEFR</th>
                                <th className="p-4">Live Status</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-slate-200">
                            {filteredStudents.slice(0, 100).map(student => (
                                <tr key={student.navaId} className="hover:bg-bg-panel-hover">
                                    <td className="p-4 font-mono text-text-muted">{student.navaId}</td>
                                    <td className="p-4 font-semibold text-text-primary">{student.fullName}</td>
                                    <td className="p-4">{companyPill(student.company)}</td>
                                    <td className="p-4 text-text-secondary">{student.techGroup}</td>
                                    <td className="p-4 text-text-secondary">{student.englishGroup}</td>
                                    <td className="p-4">{cefrPill(student.aptisScores?.overall.cefr)}</td>
                                    <td className="p-4">{statusPill(student.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredStudents.length === 0 && <div className="p-6 text-center text-text-muted">No students match the current filters or search term.</div>}
                     {filteredStudents.length > 100 && <div className="p-4 text-center text-text-muted font-semibold">Showing first 100 of {filteredStudents.length} students.</div>}
                </div>
            </div>
        </div>
    </div>
  );
};

export default KpiOverviewPage;
