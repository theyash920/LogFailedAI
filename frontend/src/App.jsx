import { useState } from 'react';
import FileUpload from './components/FileUpload';
import ResultsTable from './components/ResultsTable';

// Icons
const BrainIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const BoltIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const features = [
  {
    icon: BrainIcon,
    title: 'AI-Powered Analysis',
    description: 'Leverages LLMs and ML models to understand complex log patterns intelligently.',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: BoltIcon,
    title: 'Lightning Fast',
    description: 'Hybrid approach ensures optimal speed: regex for simple, ML for complex patterns.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: ShieldIcon,
    title: 'Highly Accurate',
    description: 'Multi-model ensemble delivers consistent and reliable classification results.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: ChartIcon,
    title: 'Batch Processing',
    description: 'Upload CSV files with thousands of logs and get instant categorization.',
    gradient: 'from-cyan-500 to-blue-500',
  },
];

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
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-0 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg">
              🔍
            </div>
            <span className="text-xl font-bold text-white">LogFailedAI</span>
          </div>
          <a
            href="https://github.com/theyash920/LogFailedAI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-sm text-slate-300 hover:text-white"
          >
            <GithubIcon />
            <span className="hidden sm:inline">Star on GitHub</span>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Hero Section */}
          {!results && (
            <div className="stagger-children">
              {/* Hero Header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Powered by Groq LLM
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                  <span className="text-white">Intelligent </span>
                  <span className="gradient-text">Log Analysis</span>
                  <br />
                  <span className="text-white">Made Simple</span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Classify and analyze your system logs instantly using our hybrid AI approach.
                  Combines regex patterns, machine learning, and LLMs for maximum accuracy.
                </p>
              </div>

              {/* Upload Card */}
              <div className="max-w-2xl mx-auto mb-20">
                <div className="glass-card rounded-3xl p-8 glow-primary">
                  <FileUpload onUpload={handleUpload} loading={loading} />
                  {error && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </div>
                  )}
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="feature-card glass-card rounded-2xl p-6 group cursor-default"
                  >
                    <div className={`feature-icon w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 transition-transform`}>
                      <feature.icon />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Stats Section */}
              <div className="glass-card rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text mb-1">&lt;1ms</div>
                  <div className="text-sm text-slate-400">Regex Speed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text mb-1">~5ms</div>
                  <div className="text-sm text-slate-400">ML Processing</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text mb-1">10K+</div>
                  <div className="text-sm text-slate-400">Logs per Batch</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text mb-1">99%</div>
                  <div className="text-sm text-slate-400">Accuracy</div>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {results && (
            <div className="animate-fade-in-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Analysis Complete</h2>
                  <p className="text-slate-400">Your logs have been classified successfully.</p>
                </div>
                <button
                  onClick={() => setResults(null)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-slate-300 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload New File
                </button>
              </div>
              <ResultsTable csvData={results} />
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span>Built with</span>
            <span className="text-red-400">❤️</span>
            <span>by</span>
            <a href="https://github.com/theyash920" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
              Yash Chopra
            </a>
          </div>
          <div className="flex items-center gap-6">
            <span>FastAPI • React • Tailwind</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
