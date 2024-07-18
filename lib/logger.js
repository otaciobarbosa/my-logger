const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

let currentLogFile = null;

function getCurrentLogFilePath() {
  const now = moment().tz('America/Sao_Paulo');
  const year = now.year();
  const month = String(now.month() + 1).padStart(2, '0');
  const day = String(now.date()).padStart(2, '0');
  const hour = String(now.hour()).padStart(2, '0');
  
  return path.join(__dirname, `../logs/${year}_${month}_${day}_${hour}.log`);
}

function log(message, type = 'info') {
  const logFilePath = getCurrentLogFilePath();

  if (logFilePath !== currentLogFile) {
    if (currentLogFile) {
      fs.closeSync(fs.openSync(currentLogFile, 'w'));
    }
    currentLogFile = logFilePath;
  }

  const timestamp = moment().tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  
  const logType = typeof type === 'string' ? type.toUpperCase() : 'INFO';

  const logMessage = `${timestamp} [${logType}]: ${message}\n`;

  fs.appendFileSync(currentLogFile, logMessage);

  console.log(`${timestamp} [${logType}]: ${message}`); 
}

module.exports = log;
