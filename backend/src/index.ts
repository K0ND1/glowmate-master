import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { env } from 'bun';

const app = express();
const port = 3000;

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware to parse JSON body
app.use(express.json());

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'GlowMate API v1',
    version: env.VERSION || '0.0.1-dev',
    timestamp: new Date().toISOString()
  });
});

// Basic API info endpoint
app.get('/v1', (req: Request, res: Response) => {
  res.json({
    name: 'GlowMate API',
    version: '1.0.0',
    description: 'Skincare product tracking and personalization system',
    endpoints: {
      health: '/',
      api: '/v1'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    path: req.path
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 GlowMate API running on http://localhost:${port}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL ? '✅ Connected' : '❌ Not configured'}`);
  console.log(`🔧 Environment: ${env.NODE_ENV || 'development'}`);
  console.log(`📦 Version: ${env.VERSION || '0.0.1-dev'}`);
});
