
import React, { useState, useMemo } from 'react';
import type { LiveStudent, LiveOpsFilters } from '../types';
import { useDashboardData } from '../hooks/useDashboardData';
import { useLiveStatus } from '../hooks/useLiveStatus';
import useClassroomStore from '../hooks/useClassroomStore';
import FloorPlan from '../components/FloorPlan';
import ClassroomStatusModal from '../components/ClassroomStatusModal';
import FloorPlanLegend from '../components/FloorPlanLegend';
import StudentDetailCard from '../components/StudentDetailCard';

interface LiveOperationsPageProps {
  dashboardData: ReturnType<typeof useDashboardData>;
  liveStatusData: ReturnType<typeof useLiveStatus>;
  filters: LiveOpsFilters;
  globalSearchTerm: string;
  setFilters: (update: (f: LiveOpsFilters) => LiveOpsFilters) => void;
  toggleArrayFilter: (filterType: 'companies' | 'techTracks' | 'englishCurriculums' | 'techGroups' | 'englishGroups' | 'classrooms' | 'aptisCEFRLevels', value: string) => void;
  clearFilters: () => void;
}

const LiveOperationsPage: React.FC<LiveOperationsPageProps> = ({ dashboardData, liveStatusData, filters, globalSearchTerm, setFilters, toggleArrayFilter, clearFilters }) => {
  const { floorPlanLayout } = dashboardData;
  const { liveStudents, occupancy } = liveStatusData;
  const { classrooms: classroomState, setOutOfService, setAvailable } = useClassroomStore();
  
  const [modalState, setModalState] = useState<{isOpen: boolean, classroomName: string | null}>({ isOpen: false, classroomName: null });
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  const filteredStudents = useMemo(() => {
      let studentsToFilter = liveStudents;

      // Global Filters
      if (filters.companies.length > 0) {
        studentsToFilter = studentsToFilter.filter(s => filters.companies.includes(s.company));
      }
      if (filters.techTracks.length > 0) {
          studentsToFilter = studentsToFilter.filter(s => filters.techTracks.includes(s.trackName));
      }
      if (filters.englishCurriculums.length > 0) {
          studentsToFilter = studentsToFilter.filter(s => filters.englishCurriculums.includes(s.englishCurriculumName));
      }
      if (filters.aptisCEFRLevels.length > 0) {
        studentsToFilter = studentsToFilter.filter(s => s.aptisScores && filters.aptisCEFRLevels.includes(s.aptisScores.overall.cefr));
      }
       if (filters.sessionType !== 'all') {
          studentsToFilter = studentsToFilter.filter(s => {
              if (s.status !== 'In Class') return false;
              if (filters.sessionType === 'tech') return s.location.startsWith('Tech');
              if (filters.sessionType === 'english') return s.location.startsWith('English');
              return false;
          });
      }

      // Search term filter (now global)
      if (globalSearchTerm) {
          const lowercasedFilter = globalSearchTerm.toLowerCase();
          studentsToFilter = studentsToFilter.filter(student =>
              student.fullName.toLowerCase().includes(lowercasedFilter) ||
              String(student.navaId).includes(lowercasedFilter) ||
              student.techGroup.toLowerCase().includes(lowercasedFilter) ||
              student.englishGroup.toLowerCase().includes(lowercasedFilter)
          );
      }

      // Status filter
      if (filters.status !== 'all') {
          studentsToFilter = studentsToFilter.filter(student => {
              const isLive = student.status === 'In Class' || student.status === 'Break';
              return filters.status === 'live' ? isLive : !isLive;
          });
      }

      // Session filter
      if (filters.session !== 'all') {
          studentsToFilter = studentsToFilter.filter(student => {
              const techScheduleInfo = dashboardData.groupInfo[student.techGroup];
              const isMorningTech = liveStatusData.isEvenWeek ? techScheduleInfo?.schedule_type.startsWith('even') : techScheduleInfo?.schedule_type.startsWith('odd');
              
              if(filters.session === 'morning') return isMorningTech;
              if(filters.session === 'afternoon') return !isMorningTech;

              return false;
          });
      }
      
      // Group filters
      if (filters.techGroups.length > 0) {
          studentsToFilter = studentsToFilter.filter(s => filters.techGroups.includes(s.techGroup));
      }
      if (filters.englishGroups.length > 0) {
          studentsToFilter = studentsToFilter.filter(s => filters.englishGroups.includes(s.englishGroup));
      }

      // Classroom filters
      if (filters.classrooms.length > 0) {
          studentsToFilter = studentsToFilter.filter(s => {
              const techClassFormatted = `C-${s.techClass.replace('.', '')}`;
              const englishClassFormatted = `C-${s.englishClass.replace('.', '')}`;
              return filters.classrooms.includes(techClassFormatted) || filters.classrooms.includes(englishClassFormatted);
          });
      }
      return studentsToFilter;
  }, [liveStudents, globalSearchTerm, filters, dashboardData.groupInfo, liveStatusData.isEvenWeek]);
  
  const highlightedClassrooms = useMemo(() => {
      const classrooms = new Set<string>();
      if(filteredStudents.length < liveStudents.length) {
          filteredStudents.forEach(student => {
              if (student.status === 'In Class') {
                  if(student.location.startsWith('Tech')) {
                      classrooms.add(`C-${student.techClass.replace('.', '')}`);
                  } else {
                      classrooms.add(`C-${student.englishClass.replace('.', '')}`);
                  }
              }
          });
      }
      return classrooms;
  }, [filteredStudents, liveStudents]);
  
  const handleFloorplanClick = (classroomName: string) => {
    setModalState({ isOpen: true, classroomName: classroomName });
  };
  
  const handleCloseModal = () => {
    setModalState({ isOpen: false, classroomName: null });
  }

  return (
    <>
    <ClassroomStatusModal 
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        classroomName={modalState.classroomName}
        liveOccupancy={occupancy}
        classroomState={classroomState}
        setOutOfService={setOutOfService}
        setAvailable={setAvailable}
    />
    <div className="grid grid-cols-1 gap-6 items-start h-full">
        {/* Main Content Column */}
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 h-full">
                    <div className="bg-bg-panel border border-slate-200 rounded-lg shadow-sm h-full flex flex-col">
                        <div className="p-4 border-b border-slate-200 flex-shrink-0">
                             <h3 className="text-lg font-bold text-text-primary">Student Roster ({filteredStudents.length})</h3>
                        </div>
                        <div className="flex-grow p-4 space-y-4 overflow-y-auto" style={{maxHeight: 'calc(100vh - 200px)'}}>
                            {filteredStudents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredStudents.map(student => (
                                        <div 
                                            key={student.navaId}
                                            onMouseEnter={() => student.status === 'In Class' && setHoveredLocation(student.location)}
                                            onMouseLeave={() => setHoveredLocation(null)}
                                        >
                                            <StudentDetailCard 
                                                student={student}
                                                isDimmed={hoveredLocation !== null && student.location !== hoveredLocation} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 text-text-muted flex flex-col items-center justify-center h-full">
                                    <h3 className="font-bold text-lg">No Students Found</h3>
                                    <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-bg-panel border border-slate-200 p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-bold text-text-primary mb-4">Interactive Floor Plan (Ground 2)</h2>
                        <FloorPlan 
                            layout={floorPlanLayout} 
                            occupancy={occupancy}
                            classroomState={classroomState}
                            selectedClassroom={null}
                            highlightedClassrooms={highlightedClassrooms}
                            onClassroomClick={handleFloorplanClick}
                        />
                        <FloorPlanLegend />
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  );
};

export default LiveOperationsPage;
