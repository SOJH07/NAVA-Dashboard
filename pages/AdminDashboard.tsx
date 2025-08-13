import React, { useState, useMemo } from 'react';
import type { Page, LiveOpsFilters, Assignment, EnhancedStudent } from '../types';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import GlobalFilterPanel from '../components/GlobalFilterPanel';
import KpiOverviewPage from './KpiOverview';
import LiveOperationsPage from './LiveOperations';
import InstructorSchedulePage from './InstructorSchedule';
import CalendarPage from './CalendarPage';
import AnalyticsPage from './AnalyticsPage';
import StudentFinderPage from './StudentFinder';
import LiveStatusSidebar from '../components/LiveStatusSidebar';
import { useDashboardData } from '../hooks/useDashboardData';
import { useLiveStatus } from '../hooks/useLiveStatus';

const pages: Page[] = [
    { id: 'kpiOverview', label: 'KPI Overview', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2z" /></svg> },
    { id: 'analytics', label: 'Performance Analytics', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg> },
    { id: 'liveOps', label: 'Live Operations', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { id: 'studentFinder', label: 'Student Finder', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg> },
    { id: 'instructorSchedule', label: 'Instructor Schedule', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { id: 'calendar', label: 'Calendar', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
];

const INITIAL_FILTERS: LiveOpsFilters = {
    status: 'all',
    session: 'all',
    sessionType: 'all',
    companies: [],
    techTracks: [],
    englishCurriculums: [],
    techGroups: [],
    englishGroups: [],
    classrooms: [],
    aptisCEFRLevels: [],
};

const AdminDashboard: React.FC = () => {
    const location = useLocation();
    const activePage = location.pathname.split('/')[2] || 'kpiOverview';
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [isLiveStatusSidebarCollapsed, setIsLiveStatusSidebarCollapsed] = useState(false);
    const [filters, setFilters] = useState<LiveOpsFilters>(INITIAL_FILTERS);
    const [globalSearchTerm, setGlobalSearchTerm] = useState('');

    const dashboardData = useDashboardData();
    const { aptisSkillAverages } = dashboardData;
    const liveStatusData = useLiveStatus(
        dashboardData.enhancedStudents,
        dashboardData.dailySchedule,
        dashboardData.groupInfo,
        dashboardData.processedScheduleData
    );

    const activeFilterCount = useMemo(() => {
        return Object.values(filters).reduce((count, filterValue) => {
            if (Array.isArray(filterValue) && filterValue.length > 0) {
                return count + filterValue.length;
            }
            if (typeof filterValue === 'string' && filterValue !== 'all') {
                return count + 1;
            }
            return count;
        }, 0);
    }, [filters]);

    const toggleArrayFilter = (
        filterType: 'companies' | 'techTracks' | 'englishCurriculums' | 'techGroups' | 'englishGroups' | 'classrooms' | 'aptisCEFRLevels',
        value: string
    ) => {
        setFilters(prevFilters => {
            const currentFilterValues = prevFilters[filterType] as string[];
            const newFilterValues = currentFilterValues.includes(value)
                ? currentFilterValues.filter(item => item !== value)
                : [...currentFilterValues, value];
            return { ...prevFilters, [filterType]: newFilterValues };
        });
    };

    const toggleSessionTypeFilter = (sessionType: 'tech' | 'english') => {
        setFilters(prev => ({
            ...prev,
            sessionType: prev.sessionType === sessionType ? 'all' : sessionType
        }));
    };

    const clearFilters = () => setFilters(INITIAL_FILTERS);

    const sessionInfo = useMemo(() => {
        const techGroupsInSession = new Set<string>();
        const englishGroupsInSession = new Set<string>();

        liveStatusData.liveStudents.forEach(student => {
            if (student.status === 'In Class') {
                if (student.location.startsWith('Tech')) {
                    techGroupsInSession.add(student.techGroup);
                } else if (student.location.startsWith('English')) {
                    englishGroupsInSession.add(student.englishGroup);
                }
            }
        });

        return {
            sessionCounts: {
                tech: techGroupsInSession.size,
                english: englishGroupsInSession.size,
            },
            sessionGroups: {
                tech: Array.from(techGroupsInSession).sort(),
                english: Array.from(englishGroupsInSession).sort((a,b) => parseInt(a.substring(1)) - parseInt(b.substring(1))),
            }
        };
    }, [liveStatusData.liveStudents]);

    return (
        <div className="h-screen flex bg-bg-body">
            <Sidebar pages={pages} />
            <GlobalFilterPanel
                isOpen={isFilterPanelOpen}
                onClose={() => setIsFilterPanelOpen(false)}
                filters={filters}
                setFilters={setFilters}
                toggleArrayFilter={toggleArrayFilter}
                clearFilters={clearFilters}
                allFilterOptions={dashboardData.allFilterOptions}
            />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header
                    pageTitle={pages.find(p => p.id === activePage)?.label || 'Dashboard'}
                    onFilterButtonClick={() => setIsFilterPanelOpen(true)}
                    activeFilterCount={activeFilterCount}
                    globalSearchTerm={globalSearchTerm}
                    onSearchChange={setGlobalSearchTerm}
                />
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <Routes>
                        <Route
                            path="kpiOverview"
                            element={<KpiOverviewPage
                                allStudents={dashboardData.enhancedStudents}
                                students={liveStatusData.liveStudents}
                                allFilterOptions={dashboardData.allFilterOptions}
                                liveStatusData={liveStatusData}
                                filters={filters}
                                globalSearchTerm={globalSearchTerm}
                                setFilters={setFilters}
                                toggleArrayFilter={toggleArrayFilter}
                                clearFilters={clearFilters}
                            />}
                        />
                        <Route
                            path="analytics"
                            element={<AnalyticsPage
                                students={dashboardData.enhancedStudents}
                                allFilterOptions={dashboardData.allFilterOptions}
                                filters={filters}
                                globalSearchTerm={globalSearchTerm}
                                toggleArrayFilter={toggleArrayFilter}
                            />}
                        />
                        <Route
                            path="liveOps"
                            element={<LiveOperationsPage
                                dashboardData={dashboardData}
                                liveStatusData={liveStatusData}
                                filters={filters}
                                globalSearchTerm={globalSearchTerm}
                                setFilters={setFilters}
                                toggleArrayFilter={toggleArrayFilter}
                                clearFilters={clearFilters}
                            />}
                        />
                        <Route
                            path="studentFinder"
                            element={<StudentFinderPage
                                enhancedStudents={dashboardData.enhancedStudents}
                                liveStudents={liveStatusData.liveStudents}
                                globalSearchTerm={globalSearchTerm}
                                aptisSkillAverages={aptisSkillAverages}
                                filters={filters}
                            />}
                        />
                        <Route
                            path="instructorSchedule"
                            element={<InstructorSchedulePage
                                filters={filters}
                                groupInfo={dashboardData.groupInfo}
                                groupCompanyMap={dashboardData.groupCompanyMap}
                                activeFilterCount={activeFilterCount}
                                dailySchedule={dashboardData.dailySchedule}
                                isEvenWeek={liveStatusData.isEvenWeek}
                                currentPeriod={liveStatusData.currentPeriod}
                                now={liveStatusData.now}
                                globalSearchTerm={globalSearchTerm}
                                allStudents={dashboardData.enhancedStudents}
                            />}
                        />
                        <Route path="calendar" element={<CalendarPage />} />
                        <Route path="*" element={<Navigate to="kpiOverview" replace />} />
                    </Routes>
                </div>
            </main>
            <LiveStatusSidebar
                liveStatusData={liveStatusData}
                dailySchedule={dashboardData.dailySchedule}
                assignments={dashboardData.processedScheduleData}
                sessionInfo={sessionInfo}
                filters={filters}
                toggleArrayFilter={toggleArrayFilter}
                toggleSessionTypeFilter={toggleSessionTypeFilter}
                isCollapsed={isLiveStatusSidebarCollapsed}
                setIsCollapsed={setIsLiveStatusSidebarCollapsed}
            />
        </div>
    );
};

export default AdminDashboard;
