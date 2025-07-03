import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import cors from 'cors';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const envPath = join(__dirname, '.env');
dotenv.config({ path: envPath });

// Verify Stripe key is loaded
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Error: STRIPE_SECRET_KEY is not set in environment variables');
  console.log('Current env path:', envPath);
  console.log('Available environment variables:', Object.keys(process.env));
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import route handlers
const createCheckoutHandler = (await import('./api/create-checkout-session.js')).handler;

// API Routes
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    await createCheckoutHandler(req, res);
  } catch (error) {
    console.error('Error in checkout route:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Something broke!', details: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Stripe key exists:', !!process.env.STRIPE_SECRET_KEY);
}); 