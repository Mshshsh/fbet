const path = require('path');
const { success, error } = require('../utils/apiResponse');

const uploadImage = (req, res) => {
  try {
    if (!req.file) return error(res, 'Dosya bulunamadı.', 400);
    const url = `/uploads/images/${req.file.filename}`;
    return success(res, { url }, 201);
  } catch (err) {
    return error(res, 'Yükleme hatası.', 500);
  }
};

module.exports = { uploadImage };
