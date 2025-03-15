const asyncHandler = require('express-async-handler');

const uploadImage = asyncHandler(async (req, res) => {
  try {
    // Check if there is a file uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file provided. Ensure the field name matches the server configuration.' 
      });
    }

    // Get the file details
    const imagePath = req.file.path; // Cloudinary path
    const imageSize = req.file.size; // File size in bytes

    return res.status(200).json({ 
      success: true, 
      message: 'Image uploaded successfully', 
      imageUrl: imagePath,
      imageSize: `${(imageSize / 1024).toFixed(2)} KB` // Convert bytes to KB for easier readability
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: 'Image upload failed', 
      error: error.message 
    });
  }
});

module.exports = {
  uploadImage,
};
