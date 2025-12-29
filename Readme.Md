# 🔍 Hybrid Log Classification System

A production-ready intelligent log classification system that combines rule-based, machine learning, and LLM approaches to automatically categorize system logs with high accuracy and flexibility.

[![Python](https://img.shields.io/badge/Python-3.10-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.6-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 Project Overview

This system implements a **hybrid classification framework** that intelligently routes log messages through three complementary approaches based on pattern complexity and data availability. The architecture ensures optimal performance across varying scenarios—from simple pattern matching to complex, few-shot classification tasks.

### Key Features

- **Multi-Strategy Classification**: Combines Regex, ML, and LLM approaches for comprehensive coverage
- **RESTful API**: FastAPI backend with automatic documentation
- **Modern Frontend**: React + Tailwind CSS responsive interface
- **Production Ready**: Dockerizable, cloud-deployable architecture
- **Batch Processing**: Efficient CSV upload and processing
- **Extensible Design**: Modular architecture for easy enhancement

## 🏗️ Architecture

```
┌─────────────────┐
│   Input Logs    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Classification  │
│     Router       │
└────────┬────────┘
         │
    ┌────┴────┬──────────────┐
    │         │              │
    ▼         ▼              ▼
┌──────┐  ┌──────┐      ┌──────┐
│Regex │  │  ML  │      │ LLM  │
│Rules │  │Model │      │Agent │
└──┬───┘  └──┬───┘      └──┬───┘
   │         │             │
   └─────────┴─────────────┘
             │
             ▼
      ┌──────────────┐
      │ Output Labels│
      └──────────────┘
```

### Classification Methods

1. **Regular Expression (Regex)**
   - Handles deterministic, rule-based patterns
   - Fastest processing for known log formats
   - Zero training data required

2. **Sentence Transformer + Logistic Regression**
   - Processes complex patterns with supervised learning
   - Uses semantic embeddings for context understanding
   - Optimal when labeled training data is available

3. **Large Language Models (LLM)**
   - Handles novel patterns and few-shot scenarios
   - Provides reasoning and context awareness
   - Fallback for insufficient training data cases

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance async API framework
- **Sentence Transformers**: State-of-the-art semantic embeddings
- **Scikit-learn**: Machine learning pipeline
- **Pandas**: Efficient data processing
- **Groq API**: LLM integration for complex classification

### Frontend
- **React 18**: Component-based UI framework
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client for API communication

### DevOps
- **Conda**: Environment management
- **Uvicorn**: ASGI server
- **CORS**: Cross-origin resource sharing
- **Docker-ready**: Containerization support

## 📁 Project Structure

```
.
├── server.py                 # FastAPI application entry point
├── requirements.txt          # Python dependencies
├── training/                 # Model training scripts
│   ├── train_model.py       # ML model training pipeline
│   └── regex_patterns.py    # Rule-based classification
├── models/                   # Serialized models
│   ├── sentence_transformer/
│   └── logistic_regression.pkl
├── resources/                # Test data and assets
│   ├── arch.png             # Architecture diagram
│   └── test_data.csv        # Sample logs
└── frontend/                 # React application
    ├── src/
    ├── package.json
    └── vite.config.js
```

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 16+ and npm
- Conda (recommended) or pip

### Backend Setup

```bash
# Create and activate conda environment
conda create -n log-classifier python=3.10
conda activate log-classifier

# Install conda packages
conda install -c conda-forge pandas=2.0.2 scikit-learn=1.6.0 joblib=1.3.2

# Install pip packages
pip install fastapi==0.115.6 python-dotenv==1.0.1 groq==0.9.0 sentence-transformers==3.3.1

# Set up environment variables
echo "GROQ_API_KEY=your_api_key_here" > .env

# Start the server
uvicorn server:app --reload
```

The API will be available at `http://127.0.0.1:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📝 API Documentation

Once the server is running, access:
- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

### Key Endpoints

```
POST /classify
- Upload CSV file with columns: source, log_message
- Returns: CSV with additional target_label column

GET /health
- Health check endpoint
- Returns: API status
```

## 📊 Input Format

Upload CSV files with the following structure:

```csv
source,log_message
system,Connection timeout after 30 seconds
application,User authentication successful
database,Query execution failed: table not found
```

## 📤 Output Format

The system returns a CSV with classified labels:

```csv
source,log_message,target_label
system,Connection timeout after 30 seconds,network_error
application,User authentication successful,auth_success
database,Query execution failed: table not found,db_error
```

## 🌐 Deployment

### Render Deployment

#### Backend Service
1. Connect your GitHub repository to Render
2. Create a new **Web Service** with:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**: Add `GROQ_API_KEY`

#### Frontend Service
1. Create a new **Static Site** with:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**: 
     - `VITE_API_URL`: Your backend service URL

### Docker Deployment

```bash
# Build the image
docker build -t log-classifier .

# Run the container
docker run -p 8000:8000 -e GROQ_API_KEY=your_key log-classifier
```

## 🧪 Testing

```bash
# Run unit tests
pytest tests/

# Test the API
curl -X POST "http://127.0.0.1:8000/classify" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@resources/test_data.csv"
```

## 🔧 Configuration

Environment variables can be configured in `.env`:

```env
GROQ_API_KEY=your_groq_api_key
MODEL_PATH=./models
MAX_FILE_SIZE=10485760  # 10MB
```

## 📈 Performance

- **Regex Classification**: <1ms per log entry
- **ML Classification**: ~5ms per log entry
- **LLM Classification**: ~100-500ms per log entry (depends on API)
- **Batch Processing**: Supports up to 10,000 logs per request

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Portfolio: [yourwebsite.com](https://yourwebsite.com)

## 🙏 Acknowledgments

- Sentence Transformers team for the embedding models
- FastAPI community for the excellent framework
- Groq for LLM API access

---

⭐ **Star this repository if you find it helpful!**