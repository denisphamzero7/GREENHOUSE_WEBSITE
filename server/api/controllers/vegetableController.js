const Crop = require('../models/vegetablesModel');
const asyncHandler = require('express-async-handler');

// Create crop(s)
const createCrop = asyncHandler(async (req, res) => {
  try {
    const cropsData = Array.isArray(req.body) ? req.body : [req.body];
    const crops = [];

    for (const cropData of cropsData) {
      const { name } = cropData;

      if (!name) {
        continue; // Skip if name is missing
      }

      const existCrop = await Crop.findOne({ name });
      if (existCrop) {
        return res.status(400).json({ message: `Crop "${name}" already exists.` });
      }

      const image = req.file ? req.file.path : null;

      const newCrop = new Crop({ name, image });
      crops.push(newCrop);
    }

    if (crops.length === 0) {
      return res.status(400).json({ message: 'No valid crops provided.' });
    }

    const createdCrops = await Crop.insertMany(crops);

    res.status(201).json({
      success: true,
      message: 'Crops created successfully.',
      data: createdCrops,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating crops.', error: error.message });
  }
});

// Get all crops with filters, sorting, and pagination
const getCrops = asyncHandler(async (req, res) => {
  try {
    const queries = { ...req.query };
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach((field) => delete queries[field]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gt|lt|eq|gte|lte)\b/g, (match) => `$${match}`);
    const formattedQueries = JSON.parse(queryString);

    if (queries?.name) {
      formattedQueries.name = { $regex: new RegExp(queries.name, 'i') };
    }

    let queryCommand = Crop.find(formattedQueries);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      queryCommand = queryCommand.sort(sortBy);
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      queryCommand = queryCommand.select(fields);
    }

    const page = +req.query.page || 1;
    const limit = +req.query.limit || +process.env.LIMIT_VEGETABLE || 10;
    const skip = (page - 1) * limit;

    queryCommand = queryCommand.skip(skip).limit(limit);

    const response = await queryCommand.exec();
    const counts = await Crop.countDocuments(formattedQueries);

    res.status(200).json({
      success: true,
      data: response,
      counts,
      page,
      totalPages: Math.ceil(counts / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching crops.', error: error.message });
  }
});

// Get a single crop by ID
const getCropById = asyncHandler(async (req, res) => {
  try {
    const { cropid } = req.params;
    const crop = await Crop.findById(cropid);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found.' });
    }
    res.status(200).json({ success: true, data: crop });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching crop.', error: error.message });
  }
});

// Update a crop
const updateCrop = asyncHandler(async (req, res) => {
  try {
    const { cropid } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required.' });
    }

    const crop = await Crop.findById(crid);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found.' });
    }

    const image = req.file ? req.file.path : crop.image;

    crop.name = name;
    crop.image = image;

    const updatedCrop = await crop.save();
    res.status(200).json({ success: true, message: 'Crop updated successfully.', data: updatedCrop });
  } catch (error) {
    res.status(500).json({ message: 'Error updating crop.', error: error.message });
  }
});

// Delete a crop
const deleteCrop = asyncHandler(async (req, res) => {
  try {
    const { cropid } = req.params;

    const crop = await Crop.findById(cropid);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found.' });
    }

    await crop.deleteOne();

    res.status(200).json({ success: true, message: 'Crop deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting crop.', error: error.message });
  }
});

module.exports = {
  createCrop,
  getCrops,
  getCropById,
  updateCrop,
  deleteCrop,
};
