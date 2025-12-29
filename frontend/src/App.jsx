import { useState } from 'react';
import FileUpload from './components/FileUpload';
import ResultsTable from './components/ResultsTable';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (file) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Use environment variable for API URL or default to localhost
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/classify/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process file');
      }

      const csvText = await response.text();
      setResults(csvText);
    } catch (err) {
      console.error(err);
      setError('An error occurred while processing the file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary filter drop-shadow-lg">
            LogFailedAI
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Intelligent log analysis powered by LLMs. Upload your CSV to classify errors instantly.
          </p>
        </div>

        {/* Main Content */}
        {!results && (
          <div className="bg-surface/50 backdrop-blur-lg border border-slate-700/50 p-8 rounded-2xl shadow-xl">
            <FileUpload onUpload={handleUpload} loading={loading} />
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-center">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Analysis Results</h2>
              <button
                onClick={() => setResults(null)}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Upload New File
              </button>
            </div>
            <ResultsTable csvData={results} />
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
