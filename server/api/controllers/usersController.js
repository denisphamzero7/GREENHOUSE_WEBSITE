
const User = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const{generateAccessToken,generateRefreshToken } = require('../middlewares/jwt');
const { sendOtpEmail } = require("../untiles/sendemail");
const ApiError= require("../untiles/apiError");
const { verify } = require("jsonwebtoken");
//register
const register = asyncHandler(async (req, res) => {
  const { email, name, password, phone, role } = req.body;
  
  // Kiểm tra các trường bắt buộc
  if (!email || !name || !password || !phone) {
    throw new ApiError(400, "fields", "Missing required fields");
  }

  // Kiểm tra xem có user nào có email hoặc phone đã tồn tại không
  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    const duplicateFields = [];
    if (existingUser.email === email) duplicateFields.push("email");
    if (existingUser.phone === phone) duplicateFields.push("phone");
    throw new ApiError(400, duplicateFields.join(", "), "ERR_EMAIL_OR_PHONE_ALREADY_EXISTS");
  }

  // Kiểm tra xem đã tồn tại admin hay chưa
  const adminExists = await User.exists({ role: "admin" });
  const userRole =
    role && ["admin", "user"].includes(role) ? role : (!adminExists ? "admin" : "user");

  // Tạo mới user
  const newUser = await User.create({ email, name, password, phone, role: userRole });

  return res.status(201).json({
    success: true,
    newUser,
    message: "User registered successfully",
  });
});

//login the user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body; // Đã được validate qua Joi

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "email", "ERR_EMAIL_NOT_FOUND");

  if (!user.isVerified)
    throw new ApiError(403, "email", "ERR_ACCOUNT_NOT_VERIFIED");

  const isMatch = await user.isCorrectPassword(password);
  if (!isMatch)
    throw new ApiError(401, "password", "ERR_PASSWORD_INCORRECT");

  const { password: pwd,otp,otpExpires, ...userData } = user.toObject();
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);
  // lưu refresh token vào database
await User.findByIdAndUpdate(user._id,{refreshToken},{new:true})
 // lưu refresh token vào cookie
 res.cookie('refreshToken',refreshToken,{httpOnly:true,maxAge:7*24*60*60*1000})
  return res.status(200).json({
    success: true,
    accessToken,
    user: userData,
    message: "Đăng nhập thành công",
  });
});
//refresh tokens
const refreshToken = asyncHandler(async(req,res)=>{
  try {
    const cookies = req.cookies;
    console.log('log cookies: ', cookies);
    if (!cookies.refreshToken) {
      throw new ApiError(403,'hiện chưa có token');
    }
    const result = await verify(cookies.refreshToken,process.env.JWT_SECRET);
    console.log(result);
    const response = await User.findOne({
      _id: result._id,
      refreshToken: { $ne: cookies.refreshToken },
    })
    if (!response) {
      throw new ApiError(403, "Token không hợp lệ");
    }
    res.status(200).json({
      success:response ? true : false,
      newAccessToken:response?generateAccessToken({_id:response._id,role:response.role})
      : 'refresh token không hợp lệ !!!!',
    });
  } catch (error) {
    throw new Error(error)
  }
})

// gửi otp 
const resendOTP =asyncHandler(async(req,res)=>{
  try {
    const {email}= req.body;
    if(!email) {
      return res.status(400).json({
        success: false,
        message: "email is required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    if(user.isVerified){
      throw new Error('User has already verified');
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // Hết hạn sau 10 phút
    await user.save();
    //gửi mail
    await sendOtpEmail(user.email,otp)
    res.status(200).json({
      success: true,
      message: "OTP has been sent to your email",
    });
  } catch (error) {
      throw new Error(error)
  }
})

// verify otp
const verifyOTP = asyncHandler(async(req,res)=>{
 try {
  const {email,otp} =req.body;
  if(!email||!otp) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }
  if(user.otpExpires < Date.now()){
    throw new Error('OTP expired');
  }
  if(user.otp!== otp){
    throw new Error('Invalid OTP');
  }
  user.isVerified = true;
  user.otp = null; // Xóa OTP sau khi xác minh
  user.otpExpires = null; // Xóa thời hạn OTP
  await user.save();
  return res.status(200).json({
    success: true,
    message: "User has been verified successfully",
  });
 } catch (error) {
  throw new Error(error)
 }

})
// lấy danh sách người dùng
const getUsers = asyncHandler(async(req, res) => {
  try {
    const queries = req.query;
    console.log(queries);
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
    let queryCommand = User.find(formattedQueries).populate('greenhouse', 'beds category crops').select('-password');

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
    const users = await queryCommand.exec();
    const counts = await User.find(formattedQueries).countDocuments();

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: 'không tìm thấy người dùng',
      });
    }

    return res.status(200).json({
      success: true,
      users,
      counts,
    });
  } catch (error) {
    throw new Error(error)
  }
})
// lấy 1 người dùng

const getUser = asyncHandler(async (req, res) => {
  try {
    const {uid } = req.params;
    const user = await User.findById(uid).populate('greenhouse', 'beds category crops');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'không tìm thấy người dùng',
      });
    }
    
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    throw new Error(error)
  }
}); 
// người dùng hiện tại

const currentUser = asyncHandler(async (req, res) => {
  const {_id} = req.user
  const user = await User.findById(_id).select('-password').select('-otp  -otpExpires').populate('greenhouse', 'beds category crops');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'không tìm thấy người dùng',
    });
  }
 
  return res.status(200).json({
    success: true,
    user,
  });

});
 // cập nhật người dùng
 const updateUser =asyncHandler(async(req, res)=>{
  try {
    const {id} = req.params
    const data = {...req.body}
    const user = await User.findByIdAndUpdate(id, data, {new: true})
    return res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    throw new Error(error)
  }
 });
 //log out user 
 const logout = asyncHandler(async(req,res)=>{
  try {
    const cookie = req.cookies
    if(!cookie||!cookie.refreshToken) throw new ApiError(404,'no refresh token in cookie' )
    await User.findOneAndUpdate({refreshToken:cookie.refreshToken},{refreshToken:''},{new:true})
   res.clearCookie('refreshToken',{
     maxAge: 0,
     httpOnly: true,
     secure: true,
   })
   return res.status(200).json({
    success:true?true:false,
    message: "Đăng xuất thành công",
   })
  } catch (error) {
    throw new Error(error)
  }
 })

module.exports = {
  register,login,getUsers,getUser,updateUser,resendOTP,verifyOTP,currentUser,refreshToken,logout
};
