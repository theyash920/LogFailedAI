import { useState, useRef } from 'react';

// Icons
const CloudUploadIcon = () => (
    <svg className="w-16 h-16 text-slate-500 group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const FileCheckIcon = () => (
    <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SparklesIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

export default function FileUpload({ onUpload, loading }) {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file) => {
        if (file.type === "text/csv" || file.name.endsWith('.csv')) {
            setFile(file);
        } else {
            alert("Please upload a valid CSV file");
        }
    };

    const handleSubmit = () => {
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Drop Zone */}
            <div
                className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ease-out overflow-hidden
          ${dragActive
                        ? 'border-primary bg-primary/10 scale-[1.01]'
                        : file
                            ? 'border-emerald-500/50 bg-emerald-500/5'
                            : 'border-slate-600/50 hover:border-primary/50 hover:bg-white/[0.02]'
                    }
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !file && inputRef.current?.click()}
            >
                {/* Animated Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${dragActive ? 'opacity-100' : ''}`} />

                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleChange}
                />

                <div className="relative z-10 flex flex-col items-center justify-center py-16 px-6">
                    {file ? (
                        <div className="flex flex-col items-center text-center animate-fade-in-up">
                            <FileCheckIcon />
                            <p className="mt-4 text-xl font-semibold text-white">{file.name}</p>
                            <p className="mt-1 text-sm text-slate-400">
                                {(file.size / 1024).toFixed(2)} KB • Ready to analyze
                            </p>
                            <button
                                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove file
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 p-4 rounded-2xl bg-slate-800/50">
                                <CloudUploadIcon />
                            </div>
                            <p className="text-xl font-semibold text-white mb-2">
                                Drop your CSV file here
                            </p>
                            <p className="text-slate-400 mb-4">
                                or <span className="text-primary hover:text-primary/80 transition-colors">browse</span> to choose a file
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Supports .csv files
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            {file && (
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3
            ${loading
                            ? 'bg-slate-700 cursor-not-allowed'
                            : 'btn-primary'
                        }
          `}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Analyzing Logs...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon />
                            <span>Analyze with AI</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
