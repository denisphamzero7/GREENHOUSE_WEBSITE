const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,  // Đảm bảo mỗi nhóm rau củ có tên duy nhất
  },
  description: {
    type: String,
    default: 'No description available',  // Mô tả về nhóm rau củ
  },
}, {
  timestamps: true,
  versionKey: false   
});
CategorySchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});
module.exports = mongoose.model('Category', CategorySchema);
