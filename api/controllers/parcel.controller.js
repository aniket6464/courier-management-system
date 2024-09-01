import Parcel from '../models/parcelModel.js';
import { errorHandler } from '../utils/error.js';

// 1. Add Parcel
export const addParcel = async (req, res, next) => {
  try {
    const { sender_name, sender_address, sender_contact, recipient_name, recipient_address, recipient_contact, type, from_branch_id, to_branch_id, parcel_details } = req.body;

    const tracking_number = `TRK-${Date.now()}`;

    const newParcel = new Parcel({
      tracking_number,
      sender_name,
      sender_address,
      sender_contact,
      recipient_name,
      recipient_address,
      recipient_contact,
      type,
      from_branch_id,
      to_branch_id,
      status: 'Item Accepted by Courier',
      parcel_details,
      track_status: [{ status: 'Item Accepted by Courier' }]
    });

    const savedParcel = await newParcel.save();
    res.status(201).json(savedParcel);
  } catch (error) {
    next(error);
  }
};

// 2. Search Parcels
// export const searchParcel = async (req, res, next) => {
//   const { search, status, sortField, sortOrder, page = 1, limit = 10 } = req.query;

//   const query = {};

//   // Search functionality
//   if (search) {
//     query.$or = [
//       { tracking_number: { $regex: search, $options: 'i' } },
//       { sender_name: { $regex: search, $options: 'i' } },
//       { recipient_name: { $regex: search, $options: 'i' } },
//       { status: { $regex: search, $options: 'i' } }
//     ];
//   }

//   if (status && status !== 'all') {
//     query.status = status;
//   }

//   // Sorting functionality
//   const sortOptions = {};
//   if (sortField && sortOrder) {
//     sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
//   }

//   // Pagination
//   const skip = (page - 1) * limit;

//   try {
//     const parcels = await Parcel.find(query)
//       .collation({ locale: "en", strength: 2 })  // Case-insensitive sorting
//       .sort(sortOptions)
//       .skip(skip)
//       .limit(parseInt(limit));

//     const totalParcels = await Parcel.countDocuments(query);
//     res.json({
//       parcels,
//       totalParcels,
//       totalPages: Math.ceil(totalParcels / limit),
//       currentPage: parseInt(page)
//     });
//   } catch (error) {
//     next(error);
//   }
// };
export const searchParcel = async (req, res, next) => {
  const { search, status, sortField, sortOrder, page = 1, limit = 10, branch_id } = req.query;

  const query = {};

  // Search functionality
  if (search) {
    query.$or = [
      { tracking_number: { $regex: search, $options: 'i' } },
      { sender_name: { $regex: search, $options: 'i' } },
      { recipient_name: { $regex: search, $options: 'i' } },
      { status: { $regex: search, $options: 'i' } }
    ];
  }

  // Filter by status
  if (status && status !== 'all') {
    query.status = status;
  }

  // Filter by branch_id
  if (branch_id) {
    query.$or = [
      { from_branch_id: branch_id },
      { to_branch_id: branch_id }
    ];
  }

  // Sorting functionality
  const sortOptions = {};
  if (sortField && sortOrder) {
    sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
  }

  // Pagination
  const skip = (page - 1) * limit;

  try {
    const parcels = await Parcel.find(query)
      .collation({ locale: "en", strength: 2 })  // Case-insensitive sorting
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalParcels = await Parcel.countDocuments(query);
    res.json({
      parcels,
      totalParcels,
      totalPages: Math.ceil(totalParcels / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get Parcel by ID
export const getParcel = async (req, res, next) => {
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) {
      return next(errorHandler(404, 'Parcel not found!'));
    }
    res.status(200).json(parcel);
  } catch (error) {
    next(error);
  }
};

// 4. Edit Parcel by ID
export const editParcel = async (req, res, next) => {
  try {
    const parcel = await Parcel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!parcel) {
      return next(errorHandler(404, 'Parcel not found!'));
    }
    res.status(200).json(parcel);
  } catch (error) {
    next(error);
  }
};

// 5. Delete Parcel by ID
export const deleteParcel = async (req, res, next) => {
  try {
    const parcel = await Parcel.findByIdAndDelete(req.params.id);
    if (!parcel) {
      return next(errorHandler(404, 'Parcel not found!'));
    }
    res.status(200).json('Parcel has been deleted!');
  } catch (error) {
    next(error);
  }
};

// 6. Update Parcel Status
export const updateParcelStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;

    const parcel = await Parcel.findById(id);
    if (!parcel) {
      return next(errorHandler(404, 'Parcel not found!'));
    }

    const statusFlow = {
      'Deliver': [
        'Item Accepted by Courier',
        'Collected',
        'Shipped',
        'In-Transit',
        'Arrived At Destination',
        'Out for Delivery',
        'Delivered',
        'Unsuccessful Delivery Attempt'
      ],
      'Pickup': [
        'Item Accepted by Courier',
        'Collected',
        'Shipped',
        'In-Transit',
        'Arrived At Destination',
        'Out for Delivery (to the branch)',
        'Ready to Pickup (at the branch)',
        'Picked-up (by the user)'
      ]
    };

    const typeFlow = parcel.type === 1 ? 'Deliver' : 'Pickup';
    const currentStatusIndex = statusFlow[typeFlow].indexOf(parcel.status);
    const newStatusIndex = statusFlow[typeFlow].indexOf(newStatus);

    if (newStatusIndex <= currentStatusIndex || newStatusIndex !== currentStatusIndex + 1) {
      return next(errorHandler(400, 'Invalid status update!'));
    }

    parcel.track_status.push({ status: newStatus });
    parcel.status = newStatus;

    await parcel.save();
    res.status(200).json(parcel);
  } catch (error) {
    next(error);
  }
};

// 7. Track Parcel by Tracking Number
export const trackParcel = async (req, res, next) => {
  try {
    const { trackingNumber } = req.params;

    const parcel = await Parcel.findOne({ tracking_number: trackingNumber });
    if (!parcel) {
      return next(errorHandler(404, 'Parcel not found!'));
    }

    res.status(200).json(parcel.track_status);
  } catch (error) {
    next(error);
  }
};

// 8. Report Parcel by Status and Date Range
export const reportParcel = async (req, res, next) => {
  try {
    const { status, startDate, endDate } = req.query;

    const query = {};

    // Filter by status if it's provided and not 'all'
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by date range if both startDate and endDate are provided
    if (startDate && endDate) {
      query.date_created = {
        $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)), // Set time to start of the day
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) // Set time to end of the day
      };
    }

    // Fetch parcels based on the query
    const parcels = await Parcel.find(query);

    // Return the list of parcels
    res.status(200).json(parcels);
  } catch (error) {
    next(error);
  }
};

