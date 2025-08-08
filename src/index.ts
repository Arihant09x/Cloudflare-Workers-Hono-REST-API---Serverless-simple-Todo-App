import { Hono, Next } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "hono/adapter";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello, World!");
});
app.post("/api/v1/signup", async (c) => {
  // Todo add zod validation here
  const body: {
    name: string;
    email: string;
    password: string;
  } = await c.req.json();
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);

  if (!DATABASE_URL) {
    return c.json({ error: "DATABASE_URL is not set" + DATABASE_URL }, 500);
  }

  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password, // ⚠️ Hash passwords in production!
      },
    });

    return c.json({
      message: "User created successfully",
      user: {
        name: body.name,
        email: body.email,
      },
    });
  } catch (error) {
    return c.json({ error: "Failed to create user" + error }, 500);
  }
});

app.post("api/v1/todo", async (c) => {
  const body: {
    title: string;
    description: string;
    done: boolean;
  } = await c.req.json();
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);

  if (!DATABASE_URL) {
    return c.json({ error: "DATABASE_URL is not set" + DATABASE_URL }, 500);
  }
  try {
    const prisma = new PrismaClient({
      datasourceUrl: DATABASE_URL,
    }).$extends(withAccelerate());

    await prisma.todo.create({
      data: {
        title: body.title,
        description: body.description,
        done: body.done,
      },
    });

    return c.json({
      message: "Todo created successfully",
      todo: {
        title: body.title,
        description: body.description,
        done: body.done,
      },
    });
  } catch (error) {
    return c.json({ error: "Failed to create todo" + error }, 500);
  }
});

export default app;
