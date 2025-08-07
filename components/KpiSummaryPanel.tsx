

import React, { useMemo } from 'react';
import type { EnhancedStudent, AptisScores } from '../types';

interface KpiSummaryPanelProps {
    students: EnhancedStudent[];
}

// Icons
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const HashtagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.47 6H16a1 1 0 110 2h-1.03l-.56 2.242a1 1 0 11-1.94-.485L12.47 8H9.53l-.56 2.242a1 1 0 11-1.94-.485L6.47 8H4a1 1 0 110-2h2.97l.56-2.243a1 1 0 011.213-.727zM9.03 14l.56-2.243h2.94l.56 2.243a1 1 0 11-1.94.485L11.53 12H8.53l-.56 2.243a1 1 0 11-1.94-.485L6.47 12H4a1 1 0 110-2h1.53l.56 2.243a1 1 0 01-.485 1.94z" clipRule="evenodd" /></svg>;
const TextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm1 2a1 1 0 011-1h1a1 1 0 110 2H6a1 1 0 01-1-1zm3 0a1 1 0 011-1h5a1 1 0 110 2H9a1 1 0 01-1-1zM5 9a1 1 0 011-1h1a1 1 0 110 2H6a1 1 0 01-1-1zm3 0a1 1 0 011-1h5a1 1 0 110 2H9a1 1 0 01-1-1zm-3 4a1 1 0 011-1h1a1 1 0 110 2H6a1 1 0 01-1-1zm3 0a1 1 0 011-1h5a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const SoundIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 15.536a5 5 0 010-7.072m2.828 9.9a9 9 0 010-12.728" /></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18m-18 0a9 9 0 0118 0m-18 0a9 9 0 0018 0" /></svg>;
const SpeakIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;

const KpiItem: React.FC<{ title: string, value: string | number, icon: React.ReactNode, valueClass?: string, titleClass?: string }> = ({ title, value, icon, valueClass = 'text-text-primary', titleClass = 'text-text-muted' }) => (
    <div className="flex items-center gap-3">
        <div className="text-text-muted">{icon}</div>
        <div>
            <p className={`text-xl font-extrabold ${valueClass}`}>{value}</p>
            <p className={`text-xs font-semibold uppercase tracking-wider ${titleClass}`}>{title}</p>
        </div>
    </div>
);

const KpiSummaryPanel: React.FC<KpiSummaryPanelProps> = ({ students }) => {

    const kpis = useMemo(() => {
        const studentsWithScores = students.filter((s): s is EnhancedStudent & { aptisScores: AptisScores } => !!s.aptisScores);
        const count = studentsWithScores.length;
        if (count === 0) return {
            avgOverallScore: 'N/A', proficiencyRate: 'N/A', mostCommonCefr: 'N/A',
            avgGrammar: 'N/A', avgListening: 'N/A', avgReading: 'N/A', avgSpeaking: 'N/A', avgWriting: 'N/A'
        };

        const scoreSums = studentsWithScores.reduce((acc, s) => {
            acc.overall += s.aptisScores.overall.score;
            acc.grammarVocabulary += s.aptisScores.grammarVocabulary.score;
            acc.listening += s.aptisScores.listening.score;
            acc.reading += s.aptisScores.reading.score;
            acc.speaking += s.aptisScores.speaking.score;
            acc.writing += s.aptisScores.writing.score;
            return acc;
        }, { overall: 0, grammarVocabulary: 0, listening: 0, reading: 0, speaking: 0, writing: 0 });

        const cefrCounts = studentsWithScores.reduce((acc, s) => {
            const cefr = s.aptisScores.overall.cefr;
            acc[cefr] = (acc[cefr] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const mostCommonCefr = Object.keys(cefrCounts).length > 0
            ? Object.keys(cefrCounts).reduce((a, b) => cefrCounts[a] > cefrCounts[b] ? a : b, 'N/A')
            : 'N/A';
        
        const proficientCount = studentsWithScores.filter(s => s.englishCurriculumName === 'ESP-II').length;
        const proficiencyRate = `${((proficientCount / count) * 100).toFixed(0)}%`;

        return {
            avgOverallScore: (scoreSums.overall / count).toFixed(1),
            proficiencyRate,
            mostCommonCefr,
            avgGrammar: (scoreSums.grammarVocabulary / count).toFixed(1),
            avgListening: (scoreSums.listening / count).toFixed(1),
            avgReading: (scoreSums.reading / count).toFixed(1),
            avgSpeaking: (scoreSums.speaking / count).toFixed(1),
            avgWriting: (scoreSums.writing / count).toFixed(1),
        };
    }, [students]);

    return (
        <div className="bg-bg-panel border border-slate-200 rounded-lg shadow-sm p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                <KpiItem title="Avg. Overall Score" value={kpis.avgOverallScore} icon={<ClockIcon/>} valueClass="text-brand-primary" />
                <KpiItem title="Proficiency Rate" value={kpis.proficiencyRate} icon={<CheckCircleIcon/>} valueClass="text-green-600" />
                <KpiItem title="Most Common CEFR" value={kpis.mostCommonCefr} icon={<HashtagIcon/>} valueClass="text-blue-600" />
                 <KpiItem title="Total Students" value={students.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>} valueClass="text-indigo-600"/>
            </div>
            <hr className="my-4 border-slate-200" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-4 gap-x-6">
                 <KpiItem title="Avg. Grammar" value={kpis.avgGrammar} icon={<TextIcon />} />
                 <KpiItem title="Avg. Listening" value={kpis.avgListening} icon={<SoundIcon />} />
                 <KpiItem title="Avg. Reading" value={kpis.avgReading} icon={<BookIcon />} />
                 <KpiItem title="Avg. Speaking" value={kpis.avgSpeaking} icon={<SpeakIcon />} />
                 <KpiItem title="Avg. Writing" value={kpis.avgWriting} icon={<PencilIcon />} />
            </div>
        </div>
    );
};

export default KpiSummaryPanel;
