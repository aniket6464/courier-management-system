import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRouter.js'
import branchRouter from './routes/branchRouter.js'
import staffRouter from './routes/staffRouter.js'
import parcelRouter from './routes/parcelRouter.js'
import adminRouter from './routes/adminRouter.js'
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO)
.then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// const password = 'adminpassword'; // Plain text password
// const hashedPassword = bcryptjs.hashSync(password, 10); // Hashing the password with a cost factor of 10

// // Example: Create a new user
// const newUser = new User({
//     firstname: 'Administrator',
//     email: 'admin@admin.com',
//     password: hashedPassword,
//     type: 1, // 1 for admin
//   });
  
//   newUser.save().then(user => {
//     console.log('User created:', user);
//   }).catch(err => {
//     console.error('Error creating user:', err);
//   });

// Create an Express app instance
const app = express();
app.use(express.json());
app.use(cookieParser());

// Define the port to run the server
const PORT = process.env.PORT || 3000;

// Create a test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working correctly' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Use the routers
app.use('/api/auth', authRouter);
app.use('/api/branch', branchRouter);
app.use('/api/staff', staffRouter);
app.use('/api/parcels', parcelRouter);
app.use('/api/admin', adminRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});