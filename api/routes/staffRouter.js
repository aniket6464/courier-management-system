import express from 'express';
import {
    createStaff,
    deleteStaff,
    updateStaff,
    searchStaff,
    getAllStaff,
    getStaffById,
    changeStaffBranch
} from '../controllers/staff.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Route to create a new staff member
router.post('/create', verifyToken(['Admin']), createStaff);

// Route to delete a staff member by ID
router.delete('/delete/:id', verifyToken(['Admin']), deleteStaff);

// Route to update a staff member by ID
router.put('/update/:id', verifyToken(['Staff']), updateStaff);

// Route to search staff members
router.get('/search', searchStaff);

// Route to get all staff members
router.get('/get', getAllStaff);

// Route to get a specific staff member by ID
router.get('/get/:id', getStaffById);

// Route to change the branch of staff 
router.post('/changeStaffBranch/:id', changeStaffBranch);

export default router;
