// require('dotenv').config();
const Beds = require('../models/bedsModel')
const asyncHandler = require('express-async-handler')

// tạo luống đất 

const createBed = asyncHandler(async (req, res) => {
  try {
    // Ensure request body is an array for consistency
    const bedData = Array.isArray(req.body) ? req.body : [req.body];

    // Validate and collect data to create beds
    const bedsToCreate = bedData.map((bed) => {
      const { name, image } = bed;
      if (!name) {
        throw new Error('Name is required for each bed.');
      }

      let imagePath = null; // Initialize imagePath
      if (req.file) {
        imagePath = req.file.path; // If file is uploaded
      } else if (image) {
        imagePath = image; // If image is provided as a URL string
      }

      return {
        name,
        image: imagePath, // Handle image upload or string
      };
    });

    // Prevent duplicate names
    const existingBeds = await Beds.find({ name: { $in: bedsToCreate.map((b) => b.name) } });
    if (existingBeds.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Beds with the following names already exist: ${existingBeds.map((b) => b.name).join(', ')}`,
      });
    }

    // Bulk create beds
    const createdBeds = await Beds.insertMany(bedsToCreate);

    // Return success response
    return res.status(200).json({
      success: true,
      message: `${createdBeds.length} bed(s) created successfully.`,
      beds: createdBeds,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create beds.',
      error: error.message,
    });
  }
});




// lấy tất cả luồng đất

const getBeds = asyncHandler(async (req, res) => {
try {
    const queries = {...req.query}
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach((field) => delete queries[field]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gt|lt|eq|gte|lte)\b/g, (match) => `$${match}`);
    const formattedQueries = JSON.parse(queryString);

    if (queries?.name) {
      formattedQueries.name = { $regex: new RegExp(queries.name, 'i') };
    }

    let queryCommand = Beds.find(formattedQueries);
  
    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(" ");
      console.log('clffh',sortBy);
      queryCommand = queryCommand.sort(sortBy);
    }

    // Limiting fields
    if (req.query?.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queryCommand = queryCommand.select(fields);
    }

    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_BEDS;
    const skip = (page - 1) * limit;

    queryCommand = queryCommand.skip(skip).limit(limit);

    const bed = await queryCommand.exec();
    const counts = await Beds.find(formattedQueries).countDocuments();

    if (!bed.length) {
      return res.status(404).json({
        success: false,
        message: 'No greenhouses found matching the criteria.',
      });
    }

    return res.status(200).json({
      success: true,
      beds:bed,
      totalCount: counts,
    });
} catch (error) {
   throw new Error(error)
}

});
//lấy 1 luống đất
const getBed = asyncHandler(async(req,res)=>{
    try {
        const {bedid}= req.params
        const bed = await Beds.findById(bedid);
        if(!bed)throw new Error("không tìm thấy luống rau này");
        return res.status(200).json({
            success: true,
            bed:bed
        })
    } catch (error) {
        throw new Error(error)
    }
})
// cập nhật luống rau
const updateBed = asyncHandler(async(req,res)=>{
  try {
    const { bedid } = req.params;

    // Kiểm tra nếu không có bedid
    if (!bedid) {
      return res.status(400).json({
        success: false,
        message: "Bed ID is required",
      });
    }

    // Chuẩn bị dữ liệu cần cập nhật
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.path; // Gán đường dẫn ảnh nếu có
    }

    // Cập nhật dữ liệu trong cơ sở dữ liệu
    const updatedBed = await Beds.findByIdAndUpdate(
      bedid,
      updateData,
      {
        new: true, // Trả về dữ liệu sau khi cập nhật
        runValidators: true, // Chạy các trình validate trong schema
      }
    );

    // Xử lý nếu không tìm thấy bản ghi
    if (!updatedBed) {
      return res.status(404).json({
        success: false,
        message: "Bed not found",
      });
    }

    // Trả về kết quả thành công
    return res.status(200).json({
      success: true,
      message: "Update successful",
      bed: updatedBed,
    });
  } catch (error) {
    // Xử lý lỗi không mong muốn
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
})
// cập nhật trạng thái trồng rau
const bedstatus = asyncHandler(async(req,res)=>{
  try {
    const {bedid,crops} = req.body;
    const bed = await Beds.findById(bedid);
    if(!bed) throw new Error("không tìm thấy luống rau này");
    if(bed.status !== empty) {
      return res.status(400).json({
        success: false,
        message: "luống rau đang trồng, bạn không thể thay đổi trạng thái"
      })
    }
    bed.crops= crops;
    bed.status = 'planted'
    await bed.save();
    return res.status(200).json({
      success: true,
      message: "Update status successful",
      bed: bed
    })
  } catch (error) {
    return res.status(500).json({ message: 'Error planting crops', error })
  }
})
// xoá luống rau

const deleteBed = asyncHandler(async(req,res)=>{
  try {
    const {bedid } = req.params;
    const bed = await Beds.findByIdAndDelete(bedid);
    if(!bed) throw new Error("không tìm thấy luống rau này");
    return res.status(200).json({
      success: true,
      message: "Delete successful",
      bed: bed
    })
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting bed', error })
  }
})
module.exports ={
    createBed,getBeds,getBed,updateBed,bedstatus,deleteBed
}