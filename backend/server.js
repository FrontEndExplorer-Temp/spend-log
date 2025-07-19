require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const app = express();
const PORT = process.env.PORT || 5000;

// Debug environment variables that might cause path-to-regexp issues
console.log('Environment check:');
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('MONGO_URI length:', process.env.MONGO_URI ? process.env.MONGO_URI.length : 0);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('JWT_REFRESH_SECRET exists:', !!process.env.JWT_REFRESH_SECRET);

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET environment variable is required but not set!');
  process.exit(1);
}

if (!process.env.JWT_REFRESH_SECRET) {
  console.error('ERROR: JWT_REFRESH_SECRET environment variable is required but not set!');
  process.exit(1);
}

// Middleware
app.use(morgan('combined'));
app.use(mongoSanitize());
app.use(xss());

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || [
    'https://spend-log.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Disposition']
};

app.use(cors({ 
  origin: process.env.CORS_ORIGIN?.split(',') || [
    'https://spend-log.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Disposition']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Add CORS to static images route
app.use('/images', cors(corsOptions), express.static(path.join(__dirname, '../assets/images')));

// MongoDB connection
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI environment variable is not set!');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI (first 50 chars):', process.env.MONGO_URI.substring(0, 50) + '...');

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1
})
.then(() => {
  console.log('MongoDB connected successfully');
  console.log('Database name:', mongoose.connection.db.databaseName);
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  process.exit(1);
});

// Expense routes placeholder
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/income', require('./routes/income'));
app.use('/api/auth', require('./routes/auth'));

// Swagger configuration
try {
  const swaggerSpec = swaggerJSDoc({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Expense Tracker API',
        version: '1.0.0',
      },
    },
    apis: ['./routes/*.js'],
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} catch (error) {
  console.error('Swagger configuration error:', error);
  // Continue without Swagger if there's an error
}

app.get('/', (req, res) => {
  res.send('Expense Tracker API');
});

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  };
  res.json(health);
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
