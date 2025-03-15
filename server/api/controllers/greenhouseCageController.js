require('dotenv').config();
const Greenhousecage = require('../models/greenhouseCageModel');
const asyncHandler = require('express-async-handler');

// Tạo lồng nhà kính
const createGreenhousecage = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    // Kiểm tra xem nhà kính có tồn tại chưa
    const existingGreenhouse = await Greenhousecage.findOne({ name });
    if (existingGreenhouse) {
      return res.status(400).json({ message: 'Greenhouse already exists' });
    }

    // Lưu ảnh nếu có
    const image = req.file ? req.file.path : null;

    const greenhousecage = await Greenhousecage.create({
      ...req.body,
      image,
    });

    res.status(201).json({
      success: true,
      greenhousecage,
      message: 'Greenhouse created successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Lấy danh sách các nhà kính
const getGreenhousecages = asyncHandler(async (req, res) => {
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

    // Chỉ tìm kiếm cần thiết với phân trang và lọc
    const page = +req.query.page || 1;
    const limit = +req.query.limit || +process.env.LIMIT_GREENHOUSECAGES || 10;
    const skip = (page - 1) * limit;

    const queryCommand = Greenhousecage.find(formattedQueries)
      .skip(skip)
      .limit(limit)
      .sort(queries?.sort || { createdAt: -1 }) // Sắp xếp theo `createdAt` mặc định
      .select(queries?.fields?.split(',').join(' ') || ''); // Giới hạn các trường

    const [greenhousecages, counts] = await Promise.all([
      queryCommand.exec(),
      Greenhousecage.countDocuments(formattedQueries), // Đếm số lượng tổng
    ]);

    if (!greenhousecages.length) {
      return res.status(404).json({
        success: false,
        message: 'No greenhouses found matching the criteria.',
      });
    }

    return res.status(200).json({
      success: true,
      greenhousecages,
      totalCount: counts,
      currentPage: page,
      totalPages: Math.ceil(counts / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Lấy 1 nhà kính
const getGreenhousecage = asyncHandler(async (req, res) => {
  const { cageid } = req.params;

  // Kiểm tra ID trước khi truy vấn
  if (!cageid.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ success: false, message: 'Invalid greenhouse ID' });
  }

  const greenhousecage = await Greenhousecage.findById(cageid);

  if (!greenhousecage) {
    return res.status(404).json({ success: false, message: 'Greenhouse not found' });
  }

  res.status(200).json({ success: true, greenhousecage });
});

// Cập nhật 1 nhà kính
const updateGreenhousecage = asyncHandler(async (req, res) => {
  const { cageid } = req.params;

  if (!cageid.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ success: false, message: 'Invalid greenhouse ID' });
  }

  const updateData = { ...req.body };
  if (req.file) {
    updateData.image = req.file.path;
  }

  const greenhousecage = await Greenhousecage.findByIdAndUpdate(cageid, updateData, {
    new: true,
  });

  if (!greenhousecage) {
    return res.status(404).json({
      success: false,
      message: 'Greenhouse not found.',
    });
  }

  res.status(200).json({
    success: true,
    greenhousecage,
  });
});

// Xóa 1 nhà kính
const deleteGreenhousecage = asyncHandler(async (req, res) => {
  const { cageid } = req.params;

  if (!cageid.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ success: false, message: 'Invalid greenhouse ID' });
  }

  const greenhousecage = await Greenhousecage.findById(cageid);
  if (!greenhousecage) {
    return res.status(404).json({ success: false, message: 'Greenhouse not found' });
  }

  await Greenhousecage.findByIdAndDelete(cageid);

  res.status(200).json({
    success: true,
    message: `Greenhouse ${greenhousecage.name} has been deleted successfully`,
  });
});

module.exports = {
  createGreenhousecage,
  getGreenhousecages,
  getGreenhousecage,
  updateGreenhousecage,
  deleteGreenhousecage,
};
