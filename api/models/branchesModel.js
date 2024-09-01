import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
    branch_code: {
        type: String,
        required: true,
        unique: true
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip_code: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true,
        unique: true
    },
    date_created: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Branch = mongoose.model('Branch', branchSchema);

export default Branch;
