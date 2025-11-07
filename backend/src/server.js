require('dotenv').config();
const express = require('express');
const cors = require('cors');


// Import routes
const brandRoutes = require('./routes/brandRoutes');
const authRouter = require('./routes/authRouters');
const templateRoutes = require('./routes/templateRoutes');
const designRoutes = require('./routes/designRouters');
const imageRoutes = require('./routes/imageRoutes');


// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'AI Marketing Asset Generator API',
    status: 'Server is running! 🚀',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (protected)'
      }
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// Auth routes
app.use('/api/auth', authRouter);
app.use('/api/brands', brandRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/images', imageRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});



// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log('========================================');
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log('========================================');
});