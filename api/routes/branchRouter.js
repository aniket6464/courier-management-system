import express from 'express';
import {
    createBranch,
    deleteBranch,
    updateBranch,
    searchBranch,
    getBranches,
    getBranch
} from '../controllers/branch.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Route to create a new branch
router.post('/create', verifyToken(['Admin']), createBranch);

// Route to delete a branch by ID
router.delete('/delete/:id', verifyToken(['Admin']), deleteBranch);

// Route to update a branch by ID
router.post('/update/:id', verifyToken(['Admin']), updateBranch);

// Route to get a specific branch by ID
router.get('/search', searchBranch);

// Route to get all branches
router.get('/get', getBranches); // staff
router.get('/get/:id', getBranch);

export default router;
