import { useState, useMemo } from 'react';

export default function ResultsTable({ csvData }) {

    const { headers, rows } = useMemo(() => {
        if (!csvData) return { headers: [], rows: [] };

        // Simple CSV parser
        const lines = csvData.trim().split('\n');
        if (lines.length === 0) return { headers: [], rows: [] };

        // Handle CSV quoting slightly better, or just standard split for now
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = lines.slice(1).map(line => {
            // This is a naive split. For production, use a library like papaparse if complex CSVs.
            // But for this demo, we assume the output CSV format is standard.
            // We match quotes if possible or just split
            // For simplicity:
            return line.split(',').map(cell => cell.trim());
        }).filter(r => r.length === headers.length); // Filter malformed rows

        return { headers, rows };
    }, [csvData]);

    const handleDownload = () => {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'classified_logs.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (!rows.length) return null;

    return (
        <div className="bg-surface border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                <h3 className="font-semibold text-slate-200">Preview ({rows.length} rows)</h3>
                <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download CSV
                </button>
            </div>

            <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-800 sticky top-0">
                        <tr>
                            {headers.map((header, i) => (
                                <th key={i} className="px-6 py-4 font-medium tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {rows.map((row, idx) => (
                            <tr key={idx} className="bg-surface hover:bg-slate-800/80 transition-colors">
                                {row.map((cell, cellIdx) => (
                                    <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-slate-300">
                                        {/* Highlight the category label if it exists (usually the last column) */}
                                        {headers[cellIdx] === 'target_label' ? (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                         ${cell.includes('Error') ? 'bg-red-900/30 text-red-400 border border-red-500/20' :
                                                    cell.includes('Warning') ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/20' :
                                                        'bg-blue-900/30 text-blue-400 border border-blue-500/20'}
                       `}>
                                                {cell}
                                            </span>
                                        ) : (
                                            cell.length > 50 ? cell.substring(0, 50) + '...' : cell
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
