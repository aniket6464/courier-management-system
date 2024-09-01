import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Parcel Details schema
const parcelDetailsSchema = new Schema({
  weight: {
    type: String, 
    required: true
  },
  height: {
    type: String, 
    required: true
  },
  width: {
    type: String, 
    required: true
  },
  length: {
    type: String, 
    required: true
  },
  price: {
    type: String, 
    required: true
  }
});

// Define the Track Status schema
const trackStatusSchema = new Schema({
  status: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
});

// Define the Parcel schema
const parcelSchema = new Schema({
  tracking_number: {
    type: String,
    required: true,
    unique: true
  },
  sender_name: {
    type: String,
    required: true
  },
  sender_address: {
    type: String,
    required: true
  },
  sender_contact: {
    type: String,
    required: true
  },
  recipient_name: {
    type: String,
    required: true
  },
  recipient_address: {
    type: String,
    required: true
  },
  recipient_contact: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    required: true,
    enum: [0, 1] // 1 = delivered, 0 = pick up
  },
  from_branch_id: {
    type: mongoose.Schema.Types.ObjectId, // Updated to ObjectId
    ref: 'Branch',
    required: true
  },
  to_branch_id: {
    type: mongoose.Schema.Types.ObjectId, // Updated to ObjectId
    ref: 'Branch',
  },
  status: {
    type: String,
    required: true
  },
  parcel_details: [parcelDetailsSchema],
  track_status: [trackStatusSchema],
  date_created: {
    type: Date,
    default: Date.now
  }
});

// Create the Parcel model from the schema
const Parcel = mongoose.model('Parcel', parcelSchema);

export default Parcel;
