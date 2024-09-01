import express from 'express';
import {
    addParcel,
    searchParcel,
    getParcel,
    editParcel,
    deleteParcel,
    updateParcelStatus,
    trackParcel,
    reportParcel
} from '../controllers/parcel.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Route to add a new parcel
router.post('/add', verifyToken(['Admin', 'Staff']), addParcel);

// Route to search for parcels
router.get('/search', searchParcel);

// Route to get a specific parcel by ID
router.get('/get/:id', getParcel);

// Route to edit a parcel by ID
router.put('/edit/:id', verifyToken(['Admin', 'Staff']), editParcel);

// Route to delete a parcel by ID
router.delete('/delete/:id', verifyToken(['Admin', 'Staff']), deleteParcel);

// Route to update the status of a parcel by ID
router.put('/update-status/:id', verifyToken(['Admin', 'Staff']), updateParcelStatus);

// Route to track a parcel by tracking number
router.get('/track/:trackingNumber', trackParcel);

// Route to generate a report for a parcel by ID
router.get('/report', reportParcel);

export default router;
