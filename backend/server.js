require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Basic route
app.get('/', (req, res) => {
  res.send('Continental Legacy Farm API');
});

// Routes
const authRouter = require('./routes/authRoutes');
app.use('/api/users', authRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});