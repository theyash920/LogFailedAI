import { useMemo } from 'react';

// Icons
const DownloadIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const TableIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

// Label color mapping
const getLabelStyle = (label) => {
    const lowerLabel = label.toLowerCase();

    if (lowerLabel.includes('error') || lowerLabel.includes('fail') || lowerLabel.includes('critical')) {
        return 'bg-red-500/15 text-red-400 border-red-500/30 shadow-red-500/10';
    }
    if (lowerLabel.includes('warning') || lowerLabel.includes('deprecat')) {
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-amber-500/10';
    }
    if (lowerLabel.includes('success') || lowerLabel.includes('complete')) {
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10';
    }
    if (lowerLabel.includes('info') || lowerLabel.includes('debug')) {
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30 shadow-sky-500/10';
    }

    return 'bg-slate-500/15 text-slate-400 border-slate-500/30 shadow-slate-500/10';
};

export default function ResultsTable({ csvData }) {
    const { headers, rows } = useMemo(() => {
        if (!csvData) return { headers: [], rows: [] };

        const lines = csvData.trim().split('\n');
        if (lines.length === 0) return { headers: [], rows: [] };

        const headers = lines[0].split(',').map(h => h.trim());
        const rows = lines.slice(1).map(line => {
            return line.split(',').map(cell => cell.trim());
        }).filter(r => r.length === headers.length);

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
        <div className="glass-card rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-800/50 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <TableIcon />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Results Preview</h3>
                        <p className="text-sm text-slate-400">{rows.length} rows classified</p>
                    </div>
                </div>
                <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                >
                    <DownloadIcon />
                    Download CSV
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-sm">
                    <thead className="text-xs uppercase tracking-wider sticky top-0 z-10">
                        <tr className="bg-slate-900/80 backdrop-blur-sm border-b border-white/5">
                            <th className="px-6 py-4 text-left text-slate-400 font-medium w-12">#</th>
                            {headers.map((header, i) => (
                                <th key={i} className="px-6 py-4 text-left text-slate-400 font-medium">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {rows.map((row, idx) => (
                            <tr
                                key={idx}
                                className="group hover:bg-white/[0.02] transition-colors"
                            >
                                <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                    {String(idx + 1).padStart(2, '0')}
                                </td>
                                {row.map((cell, cellIdx) => (
                                    <td key={cellIdx} className="px-6 py-4">
                                        {headers[cellIdx] === 'target_label' ? (
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${getLabelStyle(cell)}`}>
                                                {cell}
                                            </span>
                                        ) : headers[cellIdx] === 'log_message' ? (
                                            <span className="text-slate-300 font-mono text-xs bg-slate-800/50 px-2 py-1 rounded block max-w-md truncate" title={cell}>
                                                {cell}
                                            </span>
                                        ) : (
                                            <span className="text-slate-300">
                                                {cell.length > 40 ? cell.substring(0, 40) + '...' : cell}
                                            </span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Stats */}
            <div className="p-4 border-t border-white/5 bg-slate-900/30 flex items-center justify-between text-sm text-slate-400">
                <span>Showing all {rows.length} results</span>
                <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Classification complete
                </span>
            </div>
        </div>
    );
}
