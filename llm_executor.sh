#!/usr/bin/env bash
set -e  # Exit on critical errors (npm, pip, etc.)

# Cleanup function: Kill all background processes on script exit
cleanup() {
    echo "Cleaning up..."
    kill "$FLASK_PID" 2>/dev/null && echo "Stopped Flask (PID $FLASK_PID)"
    kill "$FRONTEND_PID" 2>/dev/null && echo "Stopped Frontend (PID $FRONTEND_PID)"
    exit 0
}
trap cleanup EXIT SIGINT SIGTERM

# 1. Install Node.js dependencies (critical)
echo "[1/6] Installing frontend dependencies..."
npm install

# 2. Set up Python virtual environment (critical)
echo "[2/6] Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# 3. Install Python requirements (critical)
echo "[3/6] Installing Python dependencies..."
pip install -r requirements.txt

# 4. Start Flask backend (background + logging)
echo "[4/6] Starting Flask backend..."
python app.py > flask.log 2>&1 &
FLASK_PID=$!
sleep 2  # Give it time to start
if ! kill -0 "$FLASK_PID" 2>/dev/null; then
    echo "[ERROR] Flask failed to start! Check flask.log"
    exit 1
fi

# 5. Start frontend (background + logging)
echo "[5/6] Starting frontend..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 2
if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
    echo "[ERROR] Frontend failed to start! Check frontend.log"
    exit 1
fi

# 6. Monitor services (optional: restart if they crash)
echo "[6/6] Monitoring services..."
echo "Flask running (PID $FLASK_PID), Frontend running (PID $FRONTEND_PID)"
echo "Logs: tail -f flask.log frontend.log"
echo "Open: http://localhost:5173"

# Keep script running until Ctrl+C
while true; do
    sleep 60  # Check every minute
    if ! kill -0 "$FLASK_PID" 2>/dev/null; then
        echo "[WARNING] Flask crashed! Restarting..."
        python app.py >> flask.log 2>&1 &
        FLASK_PID=$!
    fi
    if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
        echo "[WARNING] Frontend crashed! Restarting..."
        npm run dev >> frontend.log 2>&1 &
        FRONTEND_PID=$!
    fi
done