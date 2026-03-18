const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX     = 5 * 1024 * 1024;

module.exports = (req, res, next) => {
  if (!req.files?.image) return next();
  const img = req.files.image;
  if (!ALLOWED.includes(img.mimetype))
    return res.status(400).render('error', { title: 'Invalid File', message: 'Only JPEG, PNG, GIF, WebP images allowed.' });
  if (img.size > MAX)
    return res.status(400).render('error', { title: 'File Too Large', message: 'Image must be under 5 MB.' });
  next();
};
