// Cloudflare Workers entry point
import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import express from 'express';
import { registerRoutes } from './routes';

// Note: This is a placeholder for Cloudflare Workers deployment
// Express doesn't run directly on Workers - we need to adapt the code

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    // Create Express app
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Register routes
    await registerRoutes(app);

    // This is a simplified worker - Express needs adapter
    return new Response('Cloudflare Workers adapter needed', { status: 501 });
  },
};
