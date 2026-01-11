import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { env } from 'bun';
import helmet from 'helmet';
// import cookieParser from 'cookie-parser'; // Removed
import rateLimit from 'express-rate-limit';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './config/swagger.config';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import ingredientRoutes from './routes/ingredient.routes';
import reviewRoutes from './routes/review.routes';
import aiRoutes from './routes/ai.routes';
import premiumRoutes from './routes/premium.routes';
import waitlistRoutes from './routes/waitlist.routes';

const app = express();
app.set('trust proxy', 1); // Trust first proxy (required for rate limiting behind load balancers)
const port = 3000;

// Swagger Setup
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(helmet());
// app.use(cookieParser()); // Removed
app.use(express.json());

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per 15 minutes
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'GlowMate API v1',
    version: env.VERSION || 'undefined.dev'
  });
});

// Mount routes
app.use('/v1/auth', authRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/products', productRoutes);
app.use('/v1/ingredients', ingredientRoutes);
app.use('/v1/reviews', reviewRoutes);
app.use('/v1', reviewRoutes); // For /users/me/reviews
app.use('/v1/ai', aiRoutes);
app.use('/v1/premium', premiumRoutes);
app.use('/v1/waitlist', waitlistRoutes);

// Start server
app.listen(port, () => {
  console.log(`GlowMate API running on http://localhost:${port}`);
  console.log(`Database connected: ${process.env.DATABASE_URL ? '✅' : '❌'}`);
  console.log(`Version: ${env.VERSION || 'undefined.dev'}`);
});
