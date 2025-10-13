# School ERP SaaS System

एक मल्टी-टेनेंट स्कूल ERP प्लेटफॉर्म जो attendance, exams, student information, और communication को manage करता है।

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Shadcn/ui**
- **Zustand** (State Management)
- **NextAuth.js** (Authentication)

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **PostgreSQL** + **Prisma ORM**
- **JWT Authentication**
- **Redis** (Caching)

### Services
- **Firebase Storage** (File Storage)
- **SendGrid** (Email)
- **Twilio** (SMS)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (if not using Docker)

### Installation

#### Quick Setup (Recommended)

**Windows:**
```bash
# Run the setup script
setup.bat
```

**Linux/Mac:**
```bash
# Run the setup script
chmod +x setup.sh
./setup.sh
```

#### Manual Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd school-erp-system
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Environment Setup**
```bash
# Windows
copy env.example .env

# Linux/Mac
cp env.example .env
# Edit .env with your configuration
```

4. **Database Setup**
```bash
# Using Docker
npm run docker:up

# Or manually
npm run db:generate
npm run db:push
npm run db:seed
```

5. **Start Development**
```bash
npm run dev
```

## 📁 Project Structure

```
school-erp-system/
├── frontend/                 # Next.js Frontend
│   ├── app/                 # App Router
│   │   ├── (admin)/         # Admin routes
│   │   ├── (student)/       # Student routes
│   │   ├── (teacher)/       # Teacher routes
│   │   └── login/           # Auth routes
│   ├── components/          # Reusable components
│   ├── lib/                 # Utilities & configs
│   ├── store/               # Zustand stores
│   └── types/               # TypeScript types
├── backend/                 # Express Backend
│   ├── src/
│   │   ├── modules/         # Feature modules
│   │   ├── middlewares/     # Express middlewares
│   │   ├── prisma/          # Database setup
│   │   └── routes/          # API routes
│   └── prisma/              # Prisma schema
├── shared/                  # Shared types & utils
├── docker-compose.yml       # Docker setup
└── README.md
```

## 🔐 Authentication & Roles

- **Admin**: Full system access
- **Teacher**: Class and student management
- **Student**: Personal dashboard
- **Parent**: Child's information access

## 🏫 Multi-Tenant Architecture

हर स्कूल एक अलग tenant है:
- Custom themes और logos
- Data isolation
- Subdomain-based routing (schoolname.yourapp.com)

## 🛠️ Development Commands

```bash
# Development
npm run dev                 # Start both frontend & backend
npm run dev:frontend        # Frontend only
npm run dev:backend         # Backend only

# Building
npm run build              # Build both
npm run build:frontend     # Frontend only
npm run build:backend      # Backend only

# Database
npm run db:generate        # Generate Prisma client
npm run db:push           # Push schema changes
npm run db:seed           # Seed demo data

# Docker
npm run docker:up         # Start all services
npm run docker:down       # Stop all services
```

## 📝 Environment Variables

See `env.example` for all required environment variables.

## 🎯 Demo Credentials

After running the seed script, you can use these demo accounts:

### DPS School (dps.yourapp.com)
- **Admin:** admin@dps.com / admin123
- **Teacher:** amit@dps.com / teacher123  
- **Student:** rahul.singh@dps.com / student123
- **Parent:** ram.singh@email.com / parent123

### Modern School (modern.yourapp.com)
- **Admin:** admin@modernschool.com / admin123
- **Teacher:** sunita@modernschool.com / teacher123
- **Student:** priya.sharma@modernschool.com / student123
- **Parent:** geeta.sharma@email.com / parent123

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
