import express from 'express';
import { updateAdmin } from '../controllers/admin.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.put('/update/:id', verifyToken(['Admin']), updateAdmin);

export default router;