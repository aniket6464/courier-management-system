import Branch from '../models/branchesModel.js';
import { errorHandler } from '../utils/error.js';

// Create a new branch
export const createBranch = async (req, res, next) => {
  try {
    const branch = await Branch.create(req.body);
    return res.status(201).json(branch);
  } catch (error) {
    next(error);
  }
};

// Delete an existing branch
export const deleteBranch = async (req, res, next) => {
  const branch = await Branch.findById(req.params.id);

  if (!branch) {
    return next(errorHandler(404, 'Branch not found!'));
  }

  try {
    await Branch.findByIdAndDelete(req.params.id);
    res.status(200).json('Branch has been deleted!');
  } catch (error) {
    next(error);
  }
};

// Update an existing branch
export const updateBranch = async (req, res, next) => {
  const branch = await Branch.findById(req.params.id);
  
  if (!branch) {
    return next(errorHandler(404, 'Branch not found!'));
  }

  try {
    const updatedBranch = await Branch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedBranch);
  } catch (error) {
    next(error);
  }
};

// Get all branches
export const getBranches = async (req, res, next) => {
  try {
    const branches = await Branch.find();
    res.status(200).json(branches);
  } catch (error) {
    next(error);
  }
};

// Get a single branch by ID
export const getBranch = async (req, res, next) => {
  const { id } = req.params;

  try {
      const branch = await Branch.findById(id);

      if (!branch) {
          return next(errorHandler(404, 'Listing not found!'))
      }

      res.status(200).json(branch);
  } catch (error) {
      next(error);
  }
};

export const searchBranch = async (req, res, next) => {
  const { search, sortField, sortOrder, page = 1, limit = 10 } = req.query;

  const query = {};

  // Search functionality
  if (search) {
    query.$or = [
      { branch_code: { $regex: search, $options: 'i' } },
      { street: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
      { state: { $regex: search, $options: 'i' } },
      { country: { $regex: search, $options: 'i' } },
      { zip_code: isNaN(search) ? undefined : parseInt(search) },
      { contact: { $regex: search, $options: 'i' } }
    ];
  }

  // Sorting functionality
  let sortOptions = {};
  if (sortField && sortOrder && sortField !== 'city') {
    sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
  }

  // Pagination
  const skip = (page - 1) * limit;

  try {
    let branches = await Branch.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Case-insensitive alphabetical sorting for the city field
    if (sortField === 'city') {
      branches = branches.sort((a, b) => {
        const cityA = a.city.toLowerCase();
        const cityB = b.city.toLowerCase();

        if (cityA < cityB) return sortOrder === 'asc' ? -1 : 1;
        if (cityA > cityB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const totalBranches = await Branch.countDocuments(query);
    res.json({
      branches,
      totalBranches,
      totalPages: Math.ceil(totalBranches / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    next(err);
  }
};
