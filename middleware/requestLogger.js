module.exports = (req, res, next) => {
  const ts   = new Date().toISOString();
  const user = req.session?.user?.username || 'anonymous';
  const line = `[${ts}]  ${req.method.padEnd(7)} ${req.originalUrl.padEnd(42)} user:${user}`;
  console.log(line);
  // File logging disabled on Vercel (read-only filesystem)
  // On local, logs print to console only
  next();
};