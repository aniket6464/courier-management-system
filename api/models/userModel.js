import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the User schema
const userSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: Boolean,
    required: true,
    enum: [0, 1] // 1 = admin, 0 = staff
  },
  branch_id: {
    type: mongoose.Schema.Types.ObjectId, // Updated to ObjectId
    ref: 'Branch',
    default: null
  },
  date_created: {
    type: Date,
    default: Date.now // Automatically sets the current timestamp
  }
});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

export default User;