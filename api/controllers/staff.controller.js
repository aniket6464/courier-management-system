import User from '../models/userModel.js';
import Branch from '../models/branchesModel.js';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

// Create a new staff member
export const createStaff = async (req, res, next) => {
    const { firstname, lastname, email, password, branch_id } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(errorHandler(400, 'User with this email already exists.'));
        }

        const hashedPassword = bcryptjs.hashSync(password, 10); // Hash the password

        const newStaff = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword, // Save the hashed password
            type: false, // Ensure the user is not an admin
            branch_id
        });

        await newStaff.save();

        // Remove the password from the response object
        const { password: _, ...staffWithoutPassword } = newStaff.toObject();

        res.status(201).json(staffWithoutPassword);
    } catch (error) {
        next(error);
    }
};

// Search staff members with pagination, sorting, and search functionality
export const searchStaff = async (req, res, next) => {
    const { search, sortField, sortOrder, page = 1, limit = 10 } = req.query;

    const query = { type: false }; // Filter by type = false (staff members)

    // Pagination
    const skip = (page - 1) * limit;

    try {
        // Step 1: Lookup to join User and Branch collections
        const aggregationPipeline = [
            {
                $lookup: {
                    from: 'branches', // The name of the Branch collection in MongoDB
                    localField: 'branch_id',
                    foreignField: '_id', // branch_id references the _id in the Branch document
                    as: 'branchDetails'
                }
            },
            {
                $unwind: {
                    path: '$branchDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: query // Initial filter by type = false (staff members)
            }
        ];

        // Step 2: Add search functionality if a search term is provided
        if (search) {
            aggregationPipeline.push({
                $match: {
                    $or: [
                        { firstname: { $regex: search, $options: 'i' } },
                        { lastname: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                        { 'branchDetails.branch_code': { $regex: search, $options: 'i' } },
                        { 'branchDetails.street': { $regex: search, $options: 'i' } },
                        { 'branchDetails.city': { $regex: search, $options: 'i' } },
                        { 'branchDetails.state': { $regex: search, $options: 'i' } },
                        { 'branchDetails.zip_code': { $regex: search, $options: 'i' } },
                        { 'branchDetails.country': { $regex: search, $options: 'i' } },
                        { 'branchDetails.contact': { $regex: search, $options: 'i' } }
                    ]
                }
            });
        }

        // Step 3: Exclude the password field
        aggregationPipeline.push({
            $project: {
                password: 0 // Exclude the password field from the results
            }
        });

        // Step 4: Add sorting functionality
        if (sortField && sortOrder) {
            const sortOptions = {};
            if (sortField.startsWith('branchDetails.')) {
                // Handle sorting by fields inside the branchDetails object
                sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
            } else {
                // Handle sorting by top-level user fields
                sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
            }
            aggregationPipeline.push({ $sort: sortOptions });
        }

        // Step 5: Add pagination
        aggregationPipeline.push({ $skip: skip });
        aggregationPipeline.push({ $limit: parseInt(limit) });

        // Step 6: Execute the aggregation pipeline
        const staff = await User.aggregate(aggregationPipeline);

        // Step 7: Get the total count of staff that match the search and filter criteria
        const totalStaffPipeline = [
            ...aggregationPipeline.slice(0, -3), // Same pipeline as above, excluding sort, skip, and limit
            {
                $count: 'totalStaff'
            }
        ];

        const totalStaffResult = await User.aggregate(totalStaffPipeline);
        const totalStaff = totalStaffResult[0] ? totalStaffResult[0].totalStaff : 0;

        res.json({
            staff,
            totalStaff,
            totalPages: Math.ceil(totalStaff / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        next(error);
    }
};

// Get a single staff member by ID
export const getStaffById = async (req, res, next) => {
    const { id } = req.params;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(errorHandler(400, 'Invalid staff ID.'));
    }

    try {
        const staff = await User.findOne({ _id: id, type: false }); // Ensure the staff is non-admin

        if (!staff) {
            return next(errorHandler(404, 'Staff member not found.'));
        }

        // Remove the password from the response object
        const { password: _, ...staffWithoutPassword } = staff.toObject();

        res.status(201).json(staffWithoutPassword);
    } catch (error) {
        next(error);
    }
};

// Update staff member details
export const updateStaff = async (req, res, next) => {
    const { id } = req.params;
    const { firstname, lastname, email, password } = req.body;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(errorHandler(400, 'Invalid staff ID.'));
    }

    try {
        const staff = await User.findOne({ _id: id, type: false }); // Ensure the staff is non-admin
 
        if (!staff) {
            return next(errorHandler(404, 'Staff member not found.'));
        }

        staff.firstname = firstname || staff.firstname;
        staff.lastname = lastname || staff.lastname;
        staff.email = email || staff.email;
        staff.branch_id = staff.branch_id;

        if (password) {
            staff.password = bcryptjs.hashSync(password, 10); // Hash the new password
        }

        await staff.save();

        // Remove the password from the response object
        const { password: _, ...staffWithoutPassword } = staff.toObject();

        res.status(200).json(staffWithoutPassword);
    } catch (error) {
        next(error);
    }
};

// Delete a staff member by ID
export const deleteStaff = async (req, res, next) => {
    const { id } = req.params;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(errorHandler(400, 'Invalid staff ID.'));
    }

    try {
        const staff = await User.findOne({ _id: id, type: false }); // Ensure the staff is non-admin

        if (!staff) {
            return next(errorHandler(404, 'Staff member not found.'));
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({ message: 'Staff member deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

// Get all staff members (with type = false)
export const getAllStaff = async (req, res, next) => {
    try {
        // Query to find all users where type is false (staff members)
        const staff = await User.find({ type: false }).lean();

        // Remove the password field from each staff member
        const staffWithoutPassword = staff.map(({ password, ...staffInfo }) => staffInfo);

        res.status(200).json(staffWithoutPassword);
    } catch (error) {
        next(error);
    }
};

// Change the branch_id of a staff member
export const changeStaffBranch = async (req, res, next) => {
    const { id } = req.params;
    const { branch_id } = req.body;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(errorHandler(400, 'Invalid staff ID.'));
    }

    try {
        const staff = await User.findOne({ _id: id, type: false }); // Ensure the staff is non-admin

        if (!staff) {
            return next(errorHandler(404, 'Staff member not found.'));
        }

        staff.branch_id = branch_id;
        await staff.save();
        
        // Remove the password field from each staff member
        const { password: _, ...staffWithoutPassword } = staff.toObject();


        res.status(200).json({ message: 'Branch ID updated successfully.', staffWithoutPassword });
    } catch (error) {
        next(error);
    }
};
