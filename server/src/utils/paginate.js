/**
 * Sequelize sorguları için sayfalama yardımcısı.
 * @param {number} page  - 1'den başlar
 * @param {number} limit - sayfa başına kayıt sayısı
 */
const getPagination = (page = 1, limit = 20) => {
  const offset = (parseInt(page) - 1) * parseInt(limit);
  return { limit: parseInt(limit), offset };
};

const getPagingData = (rows, count, page, limit) => {
  const totalPages = Math.ceil(count / limit);
  return {
    items: rows,
    total: count,
    currentPage: parseInt(page),
    totalPages,
  };
};

module.exports = { getPagination, getPagingData };
