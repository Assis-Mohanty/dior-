import dotenv from 'dotenv';
import connectDB from './src/db/index.js';
import app from './app.js';

dotenv.config({
  path: './env'
});

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});