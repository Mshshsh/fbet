/**
 * Kullanıcı ID'sinden deterministik bir HSL rengi üretir.
 * Aynı ID her zaman aynı rengi verir.
 */
const generateUserColor = (userId) => {
  const str = String(userId);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  const saturation = 60 + (Math.abs(hash >> 8) % 20); // 60-80%
  const lightness = 55 + (Math.abs(hash >> 16) % 15); // 55-70%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

module.exports = { generateUserColor };
