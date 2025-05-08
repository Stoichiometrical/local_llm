@REM @echo off
@REM
@REM REM 1. Install Node.js dependencies
@REM echo [1/6] Installing frontend dependencies...
@REM npm install
@REM
@REM REM 2. Create Python virtual environment
@REM echo [2/6] Creating Python virtual environment...
@REM python -m venv venv
@REM
@REM REM 3. Activate virtual environment
@REM echo [3/6] Activating virtual environment...
@REM call venv\Scripts\activate
@REM
@REM REM 4. Install Python requirements
@REM echo [4/6] Installing Python dependencies...
@REM pip install -r requirements.txt
@REM
@REM REM 5. Start Flask backend
@REM echo [5/6] Starting Flask backend...
@REM start cmd /k "python app.py"
@REM
@REM REM 6. Start frontend
@REM echo [6/6] Starting frontend...
@REM start cmd /k "npm run dev"
@REM
@REM echo.
@REM echo All services are running!
@REM echo Open your browser and go to http://localhost:5173
@REM pause


@echo off

REM 1. Install Node.js dependencies
echo [1/6] Installing frontend dependencies...
call npm install

REM 2. Create Python virtual environment
echo [2/6] Creating Python virtual environment...
python -m venv venv

REM 3. Activate virtual environment
echo [3/6] Activating virtual environment...
call venv\Scripts\activate

REM 4. Install Python requirements
echo [4/6] Installing Python dependencies...
pip install -r requirements.txt

REM 5. Start Flask backend
echo [5/6] Starting Flask backend...
start cmd /k "python app.py"

REM 6. Start frontend
echo [6/6] Starting frontend...
start cmd /k "npm run dev"

echo.
echo All services are running!
echo Open your browser and go to http://localhost:5173
pause