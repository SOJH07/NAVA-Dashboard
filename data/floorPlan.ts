import type { FloorPlanItem } from '../types';

// Fixture used for development and tests
export const floorPlanLayoutFixture: FloorPlanItem[] = [
    { name: 'C-218', type: 'classroom', gridColumn: '1', gridRow: '1' },
    { name: 'C-217', type: 'classroom', gridColumn: '1', gridRow: '2' },
    { name: 'C-216', type: 'classroom', gridColumn: '1', gridRow: '3' },
    { name: 'C-215', type: 'classroom', gridColumn: '1', gridRow: '4' },
    { name: 'C-213', type: 'classroom', gridColumn: '1', gridRow: '5' },
    { name: 'C-212', type: 'classroom', gridColumn: '1', gridRow: '6' },
    { name: 'C-211', type: 'classroom', gridColumn: '1', gridRow: '7' },
    { name: 'C-210', type: 'classroom', gridColumn: '1', gridRow: '8' },
    { name: 'C-209', type: 'classroom', gridColumn: '1', gridRow: '9' },

    { name: 'Technical Trainers', type: 'static', gridColumn: '1 / span 2', gridRow: '10' },
    { name: 'Dean Office', type: 'static', gridColumn: '1', gridRow: '11' },
    { name: 'TUV Office', type: 'static', gridColumn: '2', gridRow: '11' },

    { name: 'C-208', type: 'classroom', gridColumn: '2', gridRow: '1' },
    { name: 'C-207', type: 'classroom', gridColumn: '2', gridRow: '2' },
    { name: 'C-206', type: 'classroom', gridColumn: '2', gridRow: '3' },
    { name: 'C-205', type: 'classroom', gridColumn: '2', gridRow: '4' },
    { name: 'C-204', type: 'classroom', gridColumn: '2', gridRow: '5' },
    { name: 'C-202', type: 'classroom', gridColumn: '2', gridRow: '6' },
    { name: 'C-201', type: 'classroom', gridColumn: '2', gridRow: '7' },
    { name: 'WS-11', type: 'lab', gridColumn: '2', gridRow: '8' },
    { name: 'WS-06', type: 'lab', gridColumn: '2', gridRow: '9' },
];

// Backwards compatibility export
export const floorPlanLayoutData = floorPlanLayoutFixture;
