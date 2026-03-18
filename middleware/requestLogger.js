const fs   = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

module.exports = (req, res, next) => {
  const ts   = new Date().toISOString();
  const user = req.session?.user?.username || 'anonymous';
  const line = `[${ts}]  ${req.method.padEnd(7)} ${req.originalUrl.padEnd(42)} user:${user}`;
  console.log(line);
  fs.appendFile(path.join(logDir, 'requests.log'), line + '\n', () => {});
  next();
};
