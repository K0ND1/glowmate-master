# GlowMate 🌟

Skincare product tracking and personalization system with AI-powered recommendations.

## 📋 Project Overview

GlowMate is a comprehensive skincare management platform that helps users:
- Track and organize skincare products
- Get personalized product recommendations
- Analyze ingredients and their effects
- Build and maintain skincare routines
- Review and rate products
- Access AI-powered skin analysis

## 🏗️ Architecture

### Backend
- **Runtime**: Bun (fast JavaScript runtime)
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for rate limiting and sessions
- **Language**: TypeScript

### Frontend
- **Framework**: React Native
- **Platform**: iOS & Android mobile apps

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh) (latest version)
- [Docker](https://www.docker.com/) and Docker Compose
- PostgreSQL 16+ (if running without Docker)
- Node.js 18+ (for frontend)

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/K0ND1/glowmate-master.git
cd glowmate-master/backend
```

2. **Install dependencies**
```bash
bun install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start with Docker (Recommended)**
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database (port 5432)
- API server (port 3000)
- Redis (port 6379)
- Redis Commander (port 8081)

5. **Or run locally**
```bash
# Make sure PostgreSQL is running locally
bun run db:push          # Push database schema
bun run prisma:generate  # Generate Prisma client
bun run dev              # Start development server
```

### Frontend Setup

```bash
cd frontend/react_native
npm install
# Follow React Native setup instructions
```

## 📦 Backend Scripts

- `bun run dev` - Start development server with hot reload
- `bun run start` - Start production server
- `bun run db:push` - Push Prisma schema to database
- `bun run db:studio` - Open Prisma Studio (database GUI)
- `bun run prisma:generate` - Generate Prisma client
- `bun run test` - Run tests

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://glowmate_admin:changeme@localhost:5432/glowmate_db"

# JWT Secret (CHANGE IN PRODUCTION!)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Environment
NODE_ENV="development"
VERSION="0.0.1-dev"
```

## 📚 API Documentation

Once the server is running, access the API at:
- Health check: `http://localhost:3000/`
- API info: `http://localhost:3000/v1`

## 🗄️ Database Schema

The database includes the following main models:
- **Users** - User accounts and profiles
- **Products** - Skincare products with details
- **Reviews** - Product reviews and ratings
- **Ingredients** - Ingredient database with properties
- **SkincareRoutines** - User's daily skincare routines
- **AiAnalyses** - AI-powered skin analysis results
- **PasswordResetTokens** - Password recovery tokens

## 🛠️ Development

### Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   ├── lib/             # Utilities and helpers
│   └── index.ts         # Application entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── docker-compose.yml   # Docker configuration
├── Dockerfile           # Container definition
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## 🐳 Docker

### Development with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start
docker-compose up -d --build
```

### Access Services
- API: http://localhost:3000
- Prisma Studio: http://localhost:5555 (if enabled)
- Redis Commander: http://localhost:8081
- PostgreSQL: localhost:5432

## 🤝 Contributing

This is a continuation of the GlowMate project. Contributions are welcome!

## 📝 License

This project is private and maintained by K0ND1.

## 🔗 Related Repositories

- Original GlowMate: https://github.com/K0ND1/glowmate

## 📧 Contact

For questions and support, please open an issue in this repository.
