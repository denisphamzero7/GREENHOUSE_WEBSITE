require('dotenv').config();
const Greenhouse = require('../models/greenhouseModel');
const asyncHandler = require('express-async-handler');

// Tạo lồng nhà kính
const creategreenhouse = asyncHandler(async (req, res) => {
  try {
    const greenhouseData = Array.isArray(req.body) ? req.body : [req.body];
    const greenhouses = [];

    for (const greenhouse of greenhouseData) {
      const { name } = greenhouse;  // Lấy tên từ từng đối tượng nhà kính
      if (!name) {
        continue;  // Nếu không có tên, bỏ qua nhà kính này
      }

      // Lưu ảnh nếu có
      const image = req.file ? req.file.path : null;

      // Tạo đối tượng nhà kính mới
      const newGreenhouse = {
        ...greenhouse,  // Spread các dữ liệu từ đối tượng greenhouse
        image
      };
      greenhouses.push(newGreenhouse);  // Đưa vào mảng greenhouses
    }

    // Chèn tất cả các nhà kính vào cơ sở dữ liệu
    await Greenhouse.insertMany(greenhouses);

    res.status(201).json({
      status: true,
      greenhouses,
      message: 'Greenhouse created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// Lấy danh sách các nhà kính
const getGreenhouses = asyncHandler(async (req, res) => {

  try {
    const queries = { ...req.query };
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach((field) => delete queries[field]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gt|lt|eq|gte|lte)\b/g, (match) => `$${match}`);
    const formattedQueries = JSON.parse(queryString);

    if (queries?.name) {
      formattedQueries.name = { $regex: new RegExp(queries.name, 'i') };
    }  

    let queryCommand = Greenhouse.find(formattedQueries).populate('cages');
  
    // Sorting
    if (req.query?.sort) {
      const sortBy = req.query?.sort.split(',').join(" ");
      queryCommand = queryCommand.sort(sortBy);
    }

    // Limiting fields
    if (req.query?.fields) {
      const fields = req.query?.fields.split(",").join(" ");
      queryCommand = queryCommand.select(fields);
    }

    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_GREENHOUSES;
    const skip = (page - 1) * limit;

    queryCommand = queryCommand.skip(skip).limit(limit);

    const greenhouses = await queryCommand.exec();
    const counts = await Greenhouse.find(formattedQueries).countDocuments();

    if (!greenhouses.length) {
      return res.status(404).json({
        success: false,
        message: 'No greenhouses found matching the criteria.',
      });
    }

    return res.status(200).json({
      success: true,
      greenhouses,
      totalCount: counts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// lấy 1 nhà kính

const getGreenhouse = asyncHandler(async (req, res) => {
  const { grid } = req.params;
   // Kiểm tra tính hợp lệ của ID trước khi truy vấn
   if (!mongoose.Types.ObjectId.isValid(grid)) {
    return res.status(404).json({ success: false, message: 'Invalid Greenhouse ID' });
  }
  const greenhouse = await Greenhouse.findById( grid );

  if (!greenhouse) {
    return res.status(404).json({ success: false,
       message: 'không tìm thấy nhà kính này ' });
  }

  res.status(200).json({ success: true, greenhouse });
});
// cập nhật 1 nhà kính

const updateGreenhouse = asyncHandler(async (req, res) => {
  const {grid} = req.params;
  const updateData = req.body;
  if (req.file) {
    updateData.image = req.file ? req.file.path:null;
  }
  const greenhouse = await Greenhouse.findByIdAndUpdate(grid, updateData, { new: true });

  if (!greenhouse) {
    return res.status(404).json({ success: false, message: 'Greenhouse not found.' });
  }

  res.status(200).json({ success: true, greenhouse });
});
// xoá 1 nhà kính
const deleteGreenhouse = asyncHandler(async(req, res)=>{
  const { grid } = req.params;
  // tìm nhà trược khi xoá
  const greenhouse = await Greenhouse.findById(grid);

  if (!greenhouse) {
    return res.status(404).json({ success: false, message: `không tìm thấy nhà kính` });
  }
  // tìm thấy rồi xoá nhà kính
  await Greenhouse.findByIdAndDelete(grid)
  res.status(200).json({ 
    success: true,
     message: `nhà kính ${greenhouse.name} đã xoá thành công` });
})
module.exports = {
  creategreenhouse,
  getGreenhouses,
  getGreenhouse,
  updateGreenhouse,
  deleteGreenhouse
};
