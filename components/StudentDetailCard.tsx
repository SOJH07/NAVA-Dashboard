
import React from 'react';
import type { LiveStudent } from '../types';

const CircuitBoardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6M9 21h6m-6-6H3m18 0h-6M5 3v18M19 3v18M9 6h6m-6 3h6m-6 6h6m-6 3h6M5 6h.01M5 12h.01M5 18h.01M19 6h-.01M19 12h-.01M19 18h-.01" />
  </svg>
);

const AtomIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle>
    <path d="M20.2 20.2c2.04-2.03.02-7.5-6-11.5s-9.44-8.04-11.5-6c-2.04 2.03-.02 7.5 6 11.5s9.44 8.04 11.5 6z"></path>
    <path d="M3.8 20.2c-2.04-2.03-.02-7.5 6-11.5s9.44-8.04 11.5-6c2.04 2.03.02 7.5-6 11.5s-9.44 8.04-11.5 6z"></path>
  </svg>
);

interface StudentDetailCardProps {
    student: LiveStudent;
    isDimmed?: boolean;
}

const StudentDetailCard: React.FC<StudentDetailCardProps> = ({ student, isDimmed }) => {
    
    let statusPill;
    switch(student.status) {
        case 'In Class':
            statusPill = <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-brand-primary text-black shadow-sm">{student.location}</span>;
            break;
        case 'Break':
            statusPill = <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-status-break-light text-status-break">{student.status}</span>;
            break;
        case 'Finished':
             statusPill = <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-status-out-of-service-light text-status-out-of-service">{student.status}</span>;
            break;
        case 'Upcoming':
            statusPill = <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-status-upcoming-light text-status-upcoming">{student.status}</span>;
            break;
        default:
            statusPill = <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-200 text-slate-800">{student.status}</span>;
    }

    const companyColor = student.company === 'Ceer' ? 'bg-brand-ceer' : 'bg-brand-lucid';
    
    const cefr = student.aptisScores?.overall.cefr;
    let cefrColorClass = 'bg-slate-200 text-slate-800';
    if(cefr) {
        if (cefr.startsWith('A')) cefrColorClass = 'bg-red-100 text-red-800';
        else if (cefr.startsWith('B')) cefrColorClass = 'bg-blue-100 text-blue-800';
        else if (cefr.startsWith('C')) cefrColorClass = 'bg-green-100 text-green-800';
    }


    return (
        <div className={`relative bg-bg-panel text-text-primary border border-slate-200 rounded-xl shadow-md p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-glow-sm hover:border-brand-primary overflow-hidden ${isDimmed ? 'opacity-40' : 'opacity-100'}`}>
            <div className={`absolute left-0 top-0 bottom-0 w-2 ${companyColor}`}></div>
            <div className="pl-4">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-bold text-lg leading-tight">{student.fullName}</h3>
                        <p className="text-xs text-text-muted">ID: {student.navaId} | {student.company}</p>
                    </div>
                    {statusPill}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                    {/* Technical Column */}
                    <div>
                        <div className="flex items-center gap-2 mb-2 font-semibold text-text-secondary">
                            <CircuitBoardIcon/>
                            <span>Technical</span>
                        </div>
                        <div className="space-y-1 pl-1 text-xs text-text-muted">
                            <p><strong className="font-medium text-text-secondary w-16 inline-block">Track:</strong> {student.trackName}</p>
                            <p><strong className="font-medium text-text-secondary w-16 inline-block">Group:</strong> {student.techGroup}</p>
                            <p><strong className="font-medium text-text-secondary w-16 inline-block">Location:</strong> C-{student.techClass.replace('.', '')}</p>
                        </div>
                    </div>

                    {/* English Column */}
                    <div>
                        <div className="flex items-center gap-2 mb-2 font-semibold text-text-secondary">
                            <AtomIcon />
                            <span>English</span>
                        </div>
                         <div className="space-y-1 pl-1 text-xs text-text-muted">
                            <p><strong className="font-medium text-text-secondary w-16 inline-block">Curriculum:</strong> <span>{student.englishCurriculumName}</span></p>
                            <p><strong className="font-medium text-text-secondary w-16 inline-block">Group:</strong> {student.englishGroup}</p>
                            <p><strong className="font-medium text-text-secondary w-16 inline-block">Location:</strong> C-{student.englishClass.replace('.', '')}</p>
                             {student.aptisScores && (
                                <>
                                 <p className="mt-2 pt-2 border-t border-slate-200/60">
                                     <strong className="font-medium text-text-secondary w-16 inline-block">Aptis:</strong> 
                                     <span className={`px-1.5 py-0.5 rounded font-bold ${cefrColorClass}`}>{cefr}</span>
                                     <span className="ml-2 font-semibold">{student.aptisScores.overall.score}</span>
                                 </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailCard;
