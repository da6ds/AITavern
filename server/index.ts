// server/index.ts
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Mechanics boundary: pick the active rules system at runtime
import { makeEngine } from "../shared/rules/index.ts";
const engine = makeEngine((process.env.GAME_SYSTEM as any) || "dnd5e");
export { engine };

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware (kept exactly as before)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  // @ts-ignore — keep existing signature passthrough
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    // @ts-ignore — preserve original behavior
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        try {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        } catch {
          // ignore stringify errors
        }
      }
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

(async () => {
  // Your routes can import { engine } from "./index.ts" and use engine.abilityCheck(), etc.
  const server = await registerRoutes(app);

  // Central error handler (unchanged)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Dev vs prod static serving (unchanged)
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Always serve on the env PORT (Replit requires this)
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
