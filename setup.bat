@echo off
echo 🚀 School ERP System Setup Script
echo ==================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from env.example...
    copy env.example .env
    echo ⚠️  Please edit .env file with your configuration
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install shared dependencies
echo 📦 Installing shared dependencies...
cd shared
call npm install
call npm run build
cd ..

echo ✅ Dependencies installed successfully

REM Start Docker services
echo 🐳 Starting Docker services...
docker-compose up -d postgres redis

REM Wait for database to be ready
echo ⏳ Waiting for database to be ready...
timeout /t 10 /nobreak >nul

REM Generate Prisma client
echo 🔧 Generating Prisma client...
cd backend
call npx prisma generate

REM Push database schema
echo 🗄️  Setting up database schema...
call npx prisma db push

REM Seed database
echo 🌱 Seeding database...
call npm run db:seed
cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Edit .env file with your configuration
echo 2. Start the development servers:
echo    npm run dev
echo.
echo 📊 Demo Credentials:
echo Admin DPS: admin@dps.com / admin123
echo Admin Modern: admin@modernschool.com / admin123
echo Teacher DPS: amit@dps.com / teacher123
echo Teacher Modern: sunita@modernschool.com / teacher123
echo Student DPS: rahul.singh@dps.com / student123
echo Student Modern: priya.sharma@modernschool.com / student123
echo Parent DPS: ram.singh@email.com / parent123
echo Parent Modern: geeta.sharma@email.com / parent123
echo.
echo 🌐 Access the application:
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo Database: localhost:5432
echo.
echo Happy coding! 🚀
pause
