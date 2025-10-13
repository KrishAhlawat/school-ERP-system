#!/bin/bash

echo "🚀 School ERP System Setup Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from env.example..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your configuration"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install shared dependencies
echo "📦 Installing shared dependencies..."
cd shared
npm install
npm run build
cd ..

echo "✅ Dependencies installed successfully"

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d postgres redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Generate Prisma client
echo "🔧 Generating Prisma client..."
cd backend
npx prisma generate

# Push database schema
echo "🗄️  Setting up database schema..."
npx prisma db push

# Seed database
echo "🌱 Seeding database..."
npm run db:seed
cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Start the development servers:"
echo "   npm run dev"
echo ""
echo "📊 Demo Credentials:"
echo "Admin DPS: admin@dps.com / admin123"
echo "Admin Modern: admin@modernschool.com / admin123"
echo "Teacher DPS: amit@dps.com / teacher123"
echo "Teacher Modern: sunita@modernschool.com / teacher123"
echo "Student DPS: rahul.singh@dps.com / student123"
echo "Student Modern: priya.sharma@modernschool.com / student123"
echo "Parent DPS: ram.singh@email.com / parent123"
echo "Parent Modern: geeta.sharma@email.com / parent123"
echo ""
echo "🌐 Access the application:"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo "Database: localhost:5432"
echo ""
echo "Happy coding! 🚀"
