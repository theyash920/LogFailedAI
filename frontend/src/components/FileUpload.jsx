import { useState, useRef } from 'react';

// Icons (using simple SVGs to avoid dependency issues)
const UploadIcon = () => (
    <svg className="w-12 h-12 mb-4 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const FileIcon = () => (
    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
            alert("Please upload a valid CSV file.");
        }
    };

    const handleSubmit = () => {
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div className="w-full">
            <div
                className={`relative group cursor-pointer flex flex-col items-center justify-center w-full h-64 rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out
          ${dragActive
                        ? 'border-primary bg-primary/10 scale-[1.02]'
                        : 'border-slate-700 hover:border-primary/50 hover:bg-slate-800/50'
                    }
          ${file ? 'border-primary border-solid bg-slate-800/50' : ''}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !file && inputRef.current.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleChange}
                />

                {file ? (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <FileIcon />
                        <p className="mt-2 text-lg font-medium text-white">{file.name}</p>
                        <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
                        <button
                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                            className="mt-4 text-xs text-red-400 hover:text-red-300 hover:underline"
                        >
                            Remove file
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center p-6">
                        <UploadIcon />
                        <p className="text-lg font-medium text-slate-200">
                            Drop your CSV log file here
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            or click to browse
                        </p>
                    </div>
                )}
            </div>

            {file && (
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`mt-6 w-full py-3.5 px-4 rounded-lg font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center
            ${loading
                            ? 'bg-slate-700 cursor-not-allowed opacity-75'
                            : 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 hover:shadow-primary/25 hover:-translate-y-0.5'
                        }
          `}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing Logs...
                        </>
                    ) : (
                        'Analyze Logs'
                    )}
                </button>
            )}
        </div>
    );
}
