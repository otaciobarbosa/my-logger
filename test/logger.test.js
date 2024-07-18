const fs = require('fs');
const path = require('path');
const log = require('../lib/logger');
const moment = require('moment-timezone');

test('should log messages correctly', () => {
  const message = 'Test message';
  const type = 'info';
  log(message, type);
  
  const now = moment().tz('America/Sao_Paulo');
  const year = now.year();
  const month = String(now.month() + 1).padStart(2, '0');
  const day = String(now.date()).padStart(2, '0');
  const hour = String(now.hour()).padStart(2, '0');
  
  const logFilePath = path.join(__dirname, `../logs/${year}_${month}_${day}_${hour}.log`);

  const logContent = fs.readFileSync(logFilePath, 'utf8');
  expect(logContent).toContain(message);
});
