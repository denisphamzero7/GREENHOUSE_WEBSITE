const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");

// Tạo danh mục
const createCategories = asyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;

    // Kiểm tra danh mục đã tồn tại
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Danh mục đã tồn tại" });
    }

    // Tạo danh mục mới
    const category = new Category({ name, description });
    await category.save();

    return res.status(201).json({
      success: true,
      category,
      message: "Danh mục đã được tạo thành công",
    });
  } catch (error) {
    console.error("Error creating category:", error.message);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// Lấy danh sách danh mục
const getCategories = asyncHandler(async (req, res) => {
  try {
    // Xử lý tham số query
    const queries = { ...req.query };
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach((field) => delete queries[field]);

    // Thay toán tử thành dạng MongoDB
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
      /\b(gt|lt|eq|gte|lte)\b/g,
      (match) => `$${match}`
    );
    const formattedQueries = JSON.parse(queryString);

    // Tìm kiếm theo tên
    if (req.query.name) {
      formattedQueries.name = { $regex: new RegExp(req.query.name, "i") };
    }

    // Khởi tạo truy vấn
    let queryCommand = Category.find(formattedQueries);

    // Sắp xếp
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queryCommand = queryCommand.sort(sortBy);
    }

    // Giới hạn trường trả về
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queryCommand = queryCommand.select(fields);
    }

    // Phân trang
    const page = Number(req.query.page) || 1;
    const limit =
      Number(req.query.limit) || Number(process.env.LIMIT_GREENHOUSECAGES) || 10;
    const skip = (page - 1) * limit;

    queryCommand = queryCommand.skip(skip).limit(limit);

    // Thực hiện truy vấn và đếm tổng số
    const [response, counts] = await Promise.all([
      queryCommand.exec(),
      Category.countDocuments(formattedQueries),
    ]);

    // Kiểm tra kết quả
    if (!response.length) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục nào phù hợp.",
      });
    }

    // Trả kết quả
    return res.status(200).json({
      success: true,
      totalCount: counts,
      categories: response,
    });
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
});
// lấy 1 danh mục

const getCategory = asyncHandler(async (req, res) => {
  try {
    const { cid } = req.params;
    const category = await Category.findById(cid);

    // Kiểm tra danh mục tồn tại
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }

    // Trả kết quả
    return res.status(200).json({ success: true, category });
  } catch (error) {
    console.error("Error fetching category:", error.message);
    return res.status(500).json({ success: false, message: "L��i server" });
  }
});
// cập nhật danh mục
const updateCategory = asyncHandler(async(req, res)=>{
  try {
    const {cid} =req.params
    const updateData = {...req.body}
    const category = await Category.findByIdAndUpdate(cid, updateData, {new: true})
    if(!category)throw new Error("không tìm thấy danh mục này");
    return res.status(200).json({
      success: true,
      category
    })
  } catch (error) {
      throw new Error(error)
  }
})

// xoá danh mục

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { cid } = req.params;
    const category = await Category.findByIdAndDelete(cid);

    // Kiểm tra danh mục tồn tại
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }

    // Trả kết quả
    return res.status(200).json({ success: true, message: "Danh mục đã xóa thành công" });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    return res.status(500).json({ success: false, message: "lỗi server" });
  }
});


module.exports = {
  createCategories,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
};
