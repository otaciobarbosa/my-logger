const fs = require('fs');
const path = require('path');
const log = require('../lib/logger');
const moment = require('moment-timezone');

test('should log messages correctly', () => {
  // Mensagens e tipo de log para o teste
  const message = 'Test message';
  const type = 'info';

  // Obtém o caminho do arquivo de log que será criado
  const now = moment().tz('America/Sao_Paulo');
  const year = now.year();
  const month = String(now.month() + 1).padStart(2, '0');
  const day = String(now.date()).padStart(2, '0');
  const hour = String(now.hour()).padStart(2, '0');
  
  const logFilePath = path.join(process.cwd(), 'logs', `${year}_${month}_${day}_${hour}.log`);

  // Remove o arquivo de log existente para garantir um teste limpo
  if (fs.existsSync(logFilePath)) {
    fs.unlinkSync(logFilePath);
  }

  // Registra a mensagem
  log(message, type);

  // Verifica se o arquivo de log foi criado e contém a mensagem esperada
  expect(fs.existsSync(logFilePath)).toBe(true); // Verifica se o arquivo foi criado
  const logContent = fs.readFileSync(logFilePath, 'utf8');
  expect(logContent).toContain(message);
  
  // Limpeza após o teste
  fs.unlinkSync(logFilePath);
});