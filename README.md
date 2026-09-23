# Anaaj (AgriNova)

A Full Stack Web Application that provides an AI & Data Engine for agriculture, integrating a Vite + React frontend with a FastAPI microservice backend.

## Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Maps:** Leaflet & React-Leaflet
- **Charts:** Recharts
- **Database/Auth:** Supabase

### Backend
- **Framework:** FastAPI (Python)
- **Server:** Uvicorn
- **Environment:** Python Virtual Environment

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python 3.8+
- Git

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/harshdwivedi374-dev/Anaaj.git
   cd Anaaj
   ```

2. **Quick Start (Windows):**
   The easiest way to start both the frontend and backend is by running the provided batch script:
   ```bash
   .\start_all.bat
   ```
   This script will:
   - Create a Python virtual environment (`backend\.venv`) if it doesn't exist
   - Install all backend dependencies from `backend\requirements.txt`
   - Start the FastAPI backend on `http://localhost:8000`
   - Start the Vite React frontend dashboard on `http://localhost:5173`

### Manual Setup

If you prefer to start them manually or are on a different OS:

**Frontend:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

**Backend:**
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

## Features

- Real-world AI & Data Engine
- Dashboard with Data Visualization (Recharts)
- Map Integration (Leaflet)
- Supabase Backend Integration for Auth/Data

## License

MIT License
