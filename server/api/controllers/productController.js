
const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler');
// tạo sản phẩm
const createProduct = asyncHandler(async(req, res)=>{
    try {
     const {name,quantity,greenhouse,beds,category,crops}=req.body;
    //  const existingname = Product.findOne({name})
    //  if(existingname) return res.status(400).json({message: 'Product already exists'})
     const product = new Product({name,quantity,greenhouse,beds,crops,category})
     await product.save();
     return res.status(201).json({success: true, product,message: 'Product saved successfully'})
    } catch (error) {
        throw new Error(error)
    }
    
});
 // lấy danh sách sản phẩm
 const getProducts = asyncHandler(async (req, res) => {
    try {
      const queries = { ...req.query };
      const excludeFields = ["limit", "sort", "page", "fields"];
      excludeFields.forEach((field) => delete queries[field]);
  
      let queryString = JSON.stringify(queries);
      queryString = queryString.replace(/\b(gt|lt|eq|gte|lte)\b/g, (match) => `$${match}`);
      const formattedQueries = JSON.parse(queryString);
  
      // Add regex filter for name if provided
      if (queries?.name) {
        formattedQueries.name = { $regex: new RegExp(queries.name, 'i') };
      }
  
      // Start building the query
      let queryCommand = Product.find(formattedQueries).populate('greenhouse', 'beds category crops');
  
      // Sorting
      if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
      }
  
      // Limiting fields
      if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
      }
  
      // Pagination
      const page = +req.query.page || 1;
      const limit = +req.query.limit || +process.env.LIMIT_PRODUCTS || 10;
      const skip = (page - 1) * limit;
  
      queryCommand = queryCommand.skip(skip).limit(limit);
  
      // Execute the query
      const products = await queryCommand.exec();
      const counts = await Product.find(formattedQueries).countDocuments();
  
      if (!products.length) {
        return res.status(404).json({
          success: false,
          message: 'No product found matching the criteria.',
        });
      }
  
      return res.status(200).json({
        success: true,
        products,
        counts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
  
// lấy 1 sản phẩm 

const getProduct = asyncHandler(async(req,res)=>{
    try {
        const {pid}=req.params
        const product = await Product.findById(pid);
        if(!product)throw new Error("không tìm thấy sản phẩm này");
        return res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        throw new Error(error)
    }
})

// cập nhật sản phẩm

const updateProduct = asyncHandler(async(req,res)=>{
    try {
        const {pid}=req.params
        const updateData = req.body;
        const product = await Product.findByIdAndUpdate(pid,updateData,{new:true});
        if(!product)throw new Error("không tìm thấy sản phẩm này");
        return res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        throw new Error(error)
    }
})
// xoá 1 sản phẩm

const deleteProduct = asyncHandler(async(req,res)=>{
    try {
        const {pid}=req.params
        const product = await Product.findByIdAndDelete(pid);
        if(!product)throw new Error("không tìm thấy sản phẩm này");
        return res.status(200).json({
            success: true,
            message: "Sản phẩm đã xoá thành công"
        })
    } catch (error) {
        throw new Error(error)
    }
})
module.exports ={
    createProduct,getProducts,getProduct,updateProduct,deleteProduct
}