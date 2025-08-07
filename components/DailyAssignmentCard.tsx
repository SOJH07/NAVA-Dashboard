import React from 'react';
import type { Assignment } from '../types';

interface DailyAssignmentCardProps {
    assignment: Assignment;
    density: 'comfortable' | 'compact';
    focusedInstructor: string | null;
    setFocusedInstructor: (instructor: string | null) => void;
    showTooltip: (content: React.ReactNode, e: React.MouseEvent) => void;
    hideTooltip: () => void;
    isLive?: boolean;
}

const BookIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>;
const LocationIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;


const DailyAssignmentCard: React.FC<DailyAssignmentCardProps> = ({ assignment, density, focusedInstructor, setFocusedInstructor, showTooltip, hideTooltip, isLive = false }) => {
    const isTech = assignment.type === 'Technical';
    const styles = {
        bg: isTech ? 'bg-status-tech-light' : 'bg-status-english-light',
        border: isTech ? 'border-status-tech' : 'border-status-english',
        text: isTech ? 'text-status-tech' : 'text-status-english',
        hoverBg: isTech ? 'hover:bg-rose-200/60' : 'hover:bg-sky-200/60',
        hoverBorder: isTech ? 'hover:border-rose-400' : 'hover:border-sky-400',
    };

    const isDimmed = focusedInstructor && !assignment.instructors.includes(focusedInstructor);

    const tooltipContent = (
        <div>
            <p className="font-bold">{assignment.group}: {assignment.topic}</p>
            <p>Classroom: C-{assignment.classroom}</p>
            <p>Period: {assignment.period}</p>
        </div>
    );

    const padding = density === 'comfortable' ? 'p-3' : 'p-2';

    return (
        <div 
            className={`relative w-full h-full rounded-xl border-l-4 flex flex-col ${padding} ${styles.border} ${styles.bg} ${styles.hoverBg} ${styles.hoverBorder} transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg ${isDimmed ? 'opacity-30' : ''} ${isLive ? 'ring-2 ring-offset-1 ring-amber-400 shadow-xl' : ''}`}
            onMouseEnter={(e) => showTooltip(tooltipContent, e)}
            onMouseLeave={hideTooltip}
        >
            {isLive && <div className="absolute top-1.5 right-1.5 text-[10px] font-bold bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full animate-pulse z-10">LIVE</div>}
            <h4 className={`font-extrabold ${density === 'comfortable' ? 'text-base' : 'text-sm'} ${styles.text} truncate`}>{assignment.group}</h4>
            
            <div className={`flex-grow mt-1 space-y-1 ${density === 'comfortable' ? 'text-sm' : 'text-xs'}`}>
                 <div className="flex items-start gap-1.5 text-text-secondary">
                    <BookIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="truncate">{assignment.topic}</span>
                </div>
                 <div className="flex items-start gap-1.5 text-text-secondary">
                    <LocationIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>C-{assignment.classroom}</span>
                </div>
            </div>

            <div className={`text-xs text-text-secondary truncate mt-auto ${density === 'comfortable' ? 'mt-2 pt-2 border-t border-slate-300/50' : 'mt-1 pt-1'}`}>
                {assignment.instructors.map((inst, index) => (
                    <span key={inst}>
                        <button
                            onClick={(e) => { e.stopPropagation(); setFocusedInstructor(inst); }}
                            className="hover:underline focus:outline-none focus:text-brand-primary disabled:no-underline disabled:cursor-default"
                            disabled={!!focusedInstructor}
                        >
                            {inst}
                        </button>
                        {index < assignment.instructors.length - 1 && ', '}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default DailyAssignmentCard;
