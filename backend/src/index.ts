import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

// Get environment variables (works with both Bun and Node)
const getEnv = (key: string, defaultValue?: string): string | undefined => {
  return process.env[key] || defaultValue;
};

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
    version: getEnv('VERSION', '0.0.1-dev'),
    timestamp: new Date().toISOString(),
  });
});

// Health check with details
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: getEnv('NODE_ENV', 'development'),
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
      healthCheck: '/health',
      api: '/v1',
    },
    features: [
      'Product tracking and management',
      'User authentication',
      'Reviews and ratings',
      'AI-powered recommendations',
      'Skincare routines',
      'Ingredient analysis',
    ],
    status: 'Foundation established - Ready for feature implementation',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    path: req.path,
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: getEnv('NODE_ENV') === 'development' ? err.message : 'Something went wrong',
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 GlowMate API running on http://localhost:${port}`);
  console.log(`📊 Database: ${getEnv('DATABASE_URL') ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`🔧 Environment: ${getEnv('NODE_ENV', 'development')}`);
  console.log(`📦 Version: ${getEnv('VERSION', '0.0.1-dev')}`);
  console.log(`\n📚 Visit http://localhost:${port}/v1 for API information`);
});
