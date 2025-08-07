import React from 'react';
import type { FloorPlanItem, OccupancyData, ClassroomState } from '../types';

interface FloorPlanProps {
    layout: FloorPlanItem[];
    occupancy: OccupancyData;
    classroomState: ClassroomState;
    selectedClassroom: string | null;
    onClassroomClick: (classroomName: string) => void;
    highlightedClassrooms?: Set<string>;
}

const WarningIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.636-1.214 2.852-1.214 3.488 0l5.584 10.68c.636 1.214-.474 2.721-1.744 2.721H4.417c-1.27 0-2.38-1.507-1.744-2.721L8.257 3.099zM10 12a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 011 1v1a1 1 0 11-2 0V9a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
)

const FloorPlan: React.FC<FloorPlanProps> = ({ layout, occupancy, classroomState, selectedClassroom, onClassroomClick, highlightedClassrooms }) => {

    const getStatusInfo = (item: FloorPlanItem) => {
        // Correctly maps names like 'C-218' to data keys like '2.18'
        const roomKey = item.name.startsWith('C-2') ? `2.${item.name.substring(3)}` : item.name;
        const manualState = classroomState[item.name];
        const occupiedInfo = occupancy[roomKey];
        
        let style = '';
        let text = '';
        let icon = null;

        if (manualState?.status === 'out-of-service') {
            style = 'bg-status-out-of-service-light border-status-out-of-service/30 text-status-out-of-service hover:bg-slate-200';
            text = manualState.reason || 'Out of Service';
            icon = <WarningIcon className="text-slate-500"/>;
        } else if (occupiedInfo) {
            style = occupiedInfo.type === 'tech'
                ? 'bg-status-tech-light border-status-tech/30 text-status-tech hover:bg-rose-200'
                : 'bg-status-english-light border-status-english/30 text-status-english hover:bg-sky-200';
            text = occupiedInfo.group;
        } else {
             switch (item.type) {
                case 'static':
                    if (item.name === 'TUV Office' || item.name === 'Dean Office' || item.name === 'Technical Trainers') {
                        style = 'bg-slate-700 border-slate-800 text-white font-semibold';
                    } else {
                        style = 'bg-slate-200 border-slate-300 text-slate-600';
                    }
                    text = 'Office';
                    break;
                case 'lab':
                    style = 'bg-purple-100 border-purple-300/50 text-purple-700 hover:bg-purple-200';
                    text = 'Vacant';
                    break;
                case 'classroom':
                default:
                    style = 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary-dark hover:bg-brand-primary/20';
                    text = 'Vacant';
                    break;
            }
        }
        
        const isSelected = selectedClassroom === item.name;
        const highlightStyle = isSelected ? 'shadow-glow-md ring-2 ring-brand-primary scale-105' : 'shadow-sm';

        let finalStyle = `${style} ${highlightStyle}`;

        if (highlightedClassrooms && highlightedClassrooms.size > 0 && !highlightedClassrooms.has(item.name)) {
            finalStyle += ' opacity-40';
        }

        return { style: finalStyle, text, icon };
    };

    return (
        <div className="grid grid-cols-2 grid-rows-[repeat(11,auto)] gap-3 w-full">
           {layout.map(item => {
                const { style, text, icon } = getStatusInfo(item);
                const isClickable = item.type !== 'static';
                
                return (
                     <button
                        key={item.name}
                        disabled={!isClickable}
                        onClick={() => isClickable && onClassroomClick(item.name)}
                        className={`border rounded-xl p-2 flex flex-col justify-center items-center transition-all duration-300 h-16 ${isClickable ? 'cursor-pointer' : 'cursor-default'} ${style}`}
                        style={{ gridColumn: item.gridColumn, gridRow: item.gridRow }}
                    >
                        <div className="flex items-center gap-1.5">
                            {icon}
                            <p className="font-bold text-sm text-center">{item.name}</p>
                        </div>
                        <p className="text-xs text-center truncate w-full">{text}</p>
                     </button>
                );
           })}
        </div>
    );
};

export default FloorPlan;