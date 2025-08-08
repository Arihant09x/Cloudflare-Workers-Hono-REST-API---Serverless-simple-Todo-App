# 🚀 Cloudflare Workers + Hono REST API - Serverless Todo App

## 📋 Project Overview

This is a **serverless RESTful API service** built with **Hono framework** and deployed on **Cloudflare Workers**, providing a complete todo management system with PostgreSQL database integration.

## 🎯 Key Features

- ✅ **User registration** endpoint (`/api/v1/signup`)
- ✅ **Todo management** system with PostgreSQL (`/api/v1/todo`)
- ✅ **Type-safe API** built with TypeScript
- ✅ **Serverless deployment** ready for Cloudflare Workers
- ✅ **RESTful API** with clean architecture

## 🏗️ Tech Stack

- **Framework**: Hono v4.9.0
- **Database**: PostgreSQL via Prisma ORM
- **Language**: TypeScript
- **Deployment**: Cloudflare Workers
- **ORM**: Prisma with Accelerate extension

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- Cloudflare account
- PostgreSQL database (Neon.tech recommended)

### Installation

```bash
# Clone the project
git clone [your-repo-url]
cd Workers

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Set up database
npx prisma generate
npx prisma migrate dev --name init

# Start development server
npm run dev
```

### Deployment

```bash
# Deploy to Cloudflare Workers
npm run deploy
```

## 📡 API Endpoints

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/`              | Health check      |
| POST   | `/api/v1/signup` | User registration |
| POST   | `/api/v1/todo`   | Todo management   |

### Example Usage

```bash
# Health check
curl https://your-worker.your-subdomain.workers.dev/

# User signup
curl -X POST https://your-worker.your-subdomain.workers.dev/api/v1/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"secure123"}'
```

## 📊 Project Structure

```
Workers/
├── src/
│   └── index.ts          # Main Hono application
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── package.json          # Dependencies & scripts
├── wrangler.jsonc        # Cloudflare Workers config
├── tsconfig.json         # TypeScript configuration
└── .env                  # Environment variables
```

## 🛠️ Development Commands

```bash
npm run dev      # Start development server
npm run deploy   # Deploy to Cloudflare Workers
npm run build    # Build for production
```

## 🔧 Configuration

Create `.env` file:

```env
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
```

## 📚 Additional Resources

- [Complete Guide](COMPLETE_GUIDE.md) - Detailed setup instructions
- [Project Summary](PROJECT_SUMMARY.md) - Executive overview
- [Hono Documentation](https://hono.dev)
- [Cloudflare Workers](https://developers.cloudflare.com/workers)

## 📝 License

MIT License - feel free to use this project as a starting point for your own applications.
