
import React, { useMemo } from 'react';
import type { EnhancedStudent } from '../types';

const UsersIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>);
const BuildingIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> );
const TrendingDownIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" /></svg> );


const KpiCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    colorClass?: string;
}> = ({ title, value, icon, colorClass = 'text-text-primary' }) => (
    <div className="flex items-center gap-4">
        <div className="flex-shrink-0">{icon}</div>
        <div>
            <p className={`text-2xl font-extrabold ${colorClass}`}>{value}</p>
            <p className="text-sm font-semibold text-text-muted">{title}</p>
        </div>
    </div>
);


interface AcademyTotalsProps {
    students: EnhancedStudent[];
}

const AcademyTotals: React.FC<AcademyTotalsProps> = ({ students }) => {
    const kpis = useMemo(() => {
        const totalStudents = students.length;
        const companyCount = new Set(students.map(s => s.company)).size;
        const studentsInSEA = students.filter(s => s.englishCurriculumName === 'SEA').length;
        const seaPercentage = totalStudents > 0 ? ((studentsInSEA / totalStudents) * 100).toFixed(0) + '%' : '0%';
        
        return { 
            totalStudents,
            companyCount,
            studentsInDevelopment: seaPercentage,
        };
    }, [students]);

    return (
        <div className="bg-bg-panel border border-slate-200 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-text-primary mb-4">Academy Stats</h3>
            <div className="space-y-4">
                <KpiCard
                    title="Total Students"
                    value={kpis.totalStudents}
                    icon={<UsersIcon className="h-8 w-8 text-indigo-500" />}
                    colorClass="text-indigo-600"
                />
                 <KpiCard
                    title="Sponsoring Companies"
                    value={kpis.companyCount}
                    icon={<BuildingIcon className="h-8 w-8 text-teal-500" />}
                    colorClass="text-teal-600"
                />
                <KpiCard
                    title="Students in Development"
                    value={kpis.studentsInDevelopment}
                    icon={<TrendingDownIcon className="h-8 w-8 text-amber-500" />}
                    colorClass="text-amber-600"
                />
            </div>
        </div>
    );
};

export default AcademyTotals;
