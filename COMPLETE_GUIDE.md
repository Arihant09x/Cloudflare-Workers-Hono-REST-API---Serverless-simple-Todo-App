not # 🚀 Cloudflare Workers + Hono Framework - Complete Setup Guide

## 📋 Project Overview

This is a **Cloudflare Workers** application built with **Hono** framework, featuring:

- **Hono**: Fast, lightweight web framework for Cloudflare Workers
- **Prisma ORM**: Database toolkit for TypeScript
- **PostgreSQL**: Database (via Cloudflare D1 or external PostgreSQL)
- **TypeScript**: Type-safe JavaScript development
- **Wrangler**: CLI tool for deploying to Cloudflare Workers

## 🎯 What This Project Does

This is a **RESTful API service** that provides:

- User registration endpoint (`/api/v1/signup`)
- Todo management system
- PostgreSQL database integration
- Type-safe API responses

## 🏗️ Architecture

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
└── README.md            # Basic setup instructions
```

## 🛠️ Step-by-Step Setup Guide

### Step 1: Prerequisites

**Required installations:**

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Cloudflare account** (free at [cloudflare.com](https://cloudflare.com))
- **PostgreSQL database** (we'll use Neon.tech - free tier)

### Step 2: Create Cloudflare Workers Project

#### Option A: From Scratch (Recommended for learning)

1. **Create project directory:**

```bash
mkdir my-cloudflare-workers
cd my-cloudflare-workers
```

2. **Initialize project:**

```bash
npm create hono@latest my-app
# Select "cloudflare-workers" template
cd my-app
```

3. **Install dependencies:**

```bash
npm install
```

#### Option B: Clone existing project

```bash
git clone [your-repo-url]
cd Workers
npm install
```

### Step 3: Database Setup (Neon.tech)

1. **Create Neon account:**

   - Go to [neon.tech](https://neon.tech)
   - Sign up for free account
   - Create new project

2. **Get database URL:**

   - Go to your Neon dashboard
   - Copy connection string
   - Format: `postgresql://username:password@host:port/database`

3. **Set environment variables:**
   Create `.env` file:

```env
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
```

### Step 4: Prisma Setup

1. **Install Prisma:**

```bash
npm install prisma @prisma/client
npm install -D prisma
```

2. **Create schema.prisma:**

```prisma
// This is your Prisma schema file
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  @@map("users")
}

model Todo {
  id          String   @id @default(cuid())
  title       String
  description String
  done        Boolean  @default(false)
  createdAt   DateTime @default(now())
  @@map("todos")
}
```

3. **Generate Prisma Client:**

```bash
npx prisma generate
```

4. **Create database migration:**

```bash
npx prisma migrate dev --name init
```

### Step 5: Hono Application Setup

1. **Basic Hono setup (src/index.ts):**

```typescript
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "hono/adapter";

const app = new Hono();

// Health check endpoint
app.get("/", (c) => {
  return c.text("Hello, World!");
});

// User signup endpoint
app.post("/api/v1/signup", async (c) => {
  const body = await c.req.json();
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);

  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: body.password, // ⚠️ Hash passwords in production!
      },
    });

    return c.json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return c.json({ error: "Failed to create user" }, 500);
  }
});

export default app;
```

### Step 6: Wrangler Configuration

Create `wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-workers-app",
  "main": "src/index.ts",
  "compatibility_date": "2024-01-01",
  "vars": {
    "ENVIRONMENT": "production"
  }
}
```

### Step 7: TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "allowJs": true,
    "strict": true,
    "skipLibCheck": true,
    "lib": ["ES2022"],
    "types": ["@cloudflare/workers-types"]
  }
}
```

### Step 8: Development & Testing

1. **Start development server:**

```bash
npm run dev
```

Access at: `http://localhost:8787`

2. **Test endpoints:**

```bash
# Test GET endpoint
curl http://localhost:8787/

# Test POST endpoint
curl -X POST http://localhost:8787/api/v1/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"secure123"}'
```

### Step 9: Deployment to Cloudflare

1. **Login to Cloudflare:**

```bash
npx wrangler login
```

2. **Deploy application:**

```bash
npm run deploy
```

3. **Get production URL:**
   After deployment, you'll get a URL like:
   `https://my-workers-app.your-subdomain.workers.dev`

## 📸 Visual Guide with Screenshots

### 1. Neon Database Setup

```
┌─────────────────────────────────────┐
│         Neon Dashboard              │
├─────────────────────────────────────┤
│  📊 Projects                        │
│  └── 📁 my-project                 │
│      └── 🗄️ Database               │
│          └── 📋 Connection String   │
└─────────────────────────────────────┘
```

### 2. Project Structure

```
my-workers-app/
├── 📁 src/
│   └── 📄 index.ts          # 🏠 Main app
├── 📁 prisma/
│   ├── 📄 schema.prisma     # 🗄️ Database schema
│   └── 📁 migrations/       # 🔄 Database changes
├── 📄 package.json          # 📦 Dependencies
├── 📄 wrangler.jsonc        # ⚙️ Cloudflare config
└── 📄 .env                 # 🔐 Environment variables
```

### 3. API Endpoints Flow

```
Client Request → Cloudflare Edge → Hono App → Prisma → Database
     ↓              ↓              ↓         ↓         ↓
  HTTP Request → Worker Runtime → Routes → ORM → PostgreSQL
     ↓              ↓              ↓         ↓         ↓
  JSON Response ← Worker Runtime ← Routes ← ORM ← PostgreSQL
```

## 🔧 Advanced Features

### 1. Environment Variables

```typescript
// Access environment variables
const { DATABASE_URL, API_KEY } = env<{
  DATABASE_URL: string;
  API_KEY: string;
}>(c);
```

### 2. Middleware

```typescript
// Add logging middleware
app.use("*", async (c, next) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`);
  await next();
});
```

### 3. Error Handling

```typescript
// Global error handler
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ error: "Internal Server Error" }, 500);
});
```

### 4. Validation with Zod

```bash
npm install zod @hono/zod-validator
```

```typescript
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

app.post("/api/v1/signup", zValidator("json", signupSchema), async (c) => {
  const data = c.req.valid("json");
  // Process validated data
});
```

## 🐛 Troubleshooting

### Common Issues:

1. **"DATABASE_URL is not set"**

   - Check `.env` file exists
   - Verify DATABASE_URL format
   - Ensure no spaces in connection string

2. **Prisma Client errors**

   - Run `npx prisma generate`
   - Check database connection
   - Verify schema.prisma syntax

3. **Deployment failures**
   - Check wrangler login status
   - Verify wrangler.jsonc syntax
   - Check TypeScript compilation errors

### Debug Commands:

```bash
# Check wrangler status
npx wrangler whoami

# Check logs
npx wrangler tail

# Test database connection
npx prisma db pull
```

## 📚 Additional Resources

- **Hono Documentation**: [hono.dev](https://hono.dev)
- **Cloudflare Workers**: [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers)
- **Prisma Documentation**: [prisma.io/docs](https://prisma.io/docs)
- **Neon Database**: [neon.tech/docs](https://neon.tech/docs)

## 🎉 Next Steps

1. Add authentication (JWT tokens)
2. Implement CRUD operations for todos
3. Add rate limiting
4. Implement caching with Cloudflare KV
5. Add monitoring with Cloudflare Analytics
6. Set up CI/CD with GitHub Actions

## 📞 Support

If you encounter issues:

1. Check this documentation
2. Search [Cloudflare Workers Discord](https://discord.gg/cloudflaredev)
3. Create GitHub issue in your repository
4. Ask questions on [Cloudflare Community](https://community.cloudflare.com)
