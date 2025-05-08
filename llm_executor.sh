#!/usr/bin/env bash
set -e

# 1. Install Node.js dependencies
echo "[1/6] Installing frontend dependencies..."
npm install

# 2. Create Python virtual environment
echo "[2/6] Creating Python virtual environment..."
python3 -m venv venv

# 3. Activate virtual environment
echo "[3/6] Activating virtual environment..."
source venv/bin/activate

# 4. Install Python requirements
echo "[4/6] Installing Python dependencies..."
pip install -r requirements.txt

# 5. Start Flask backend
echo "[5/6] Starting Flask backend..."
python app.py &

# 6. Start frontend
echo "[6/6] Starting frontend..."
npm run dev &

wait

echo
 echo "All services are running!"
echo "Open your browser and go to http://localhost:5173"