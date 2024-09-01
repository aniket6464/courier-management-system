import User from '../models/userModel.js';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

export const updateAdmin = async (req, res, next) => {
    const { id } = req.params;
    const { firstname, lastname, email, password } = req.body;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(errorHandler(400, 'Invalid admin ID.'));
    }

    try {
        const admin = await User.findOne({ _id: id, type: true }); // Ensure the admin is correctly identified

        if (!admin) {
            return next(errorHandler(404, 'Admin not found.'));
        }

        // Update the admin's details
        admin.firstname = firstname || admin.firstname;
        admin.lastname = lastname || admin.lastname;
        admin.email = email || admin.email;

        if (password) {
            admin.password = bcryptjs.hashSync(password, 10); // Hash the new password
        }

        await admin.save();

        // Remove the password from the response object
        const { password: _, ...adminWithoutPassword } = admin.toObject();

        res.status(200).json(adminWithoutPassword);
    } catch (error) {
        next(error);
    }
};
