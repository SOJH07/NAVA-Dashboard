import React from 'react';

const legendItems = [
    { label: 'Tech Class', color: 'bg-status-tech' },
    { label: 'English Class', color: 'bg-status-english' },
    { label: 'Vacant', color: 'bg-status-vacant' },
    { label: 'Out of Service', color: 'bg-status-out-of-service' },
];

const FloorPlanLegend: React.FC = () => {
    return (
        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-center flex-wrap gap-x-6 gap-y-2">
            {legendItems.map(item => (
                <div key={item.label} className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-md ${item.color}`}></span>
                    <span className="text-sm text-text-secondary">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

export default FloorPlanLegend;