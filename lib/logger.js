const fs = require('fs'); // Módulo para operações de sistema de arquivos
const path = require('path'); // Módulo para manipulação de caminhos de arquivos
const moment = require('moment-timezone'); // Biblioteca para manipulação de datas e fusos horários

let currentLogFile = null; // Variável para armazenar o caminho do arquivo de log atual

/**
 * Gera o caminho completo do arquivo de log baseado na data e hora atuais.
 * @returns {string} Caminho completo do arquivo de log.
 */
function getCurrentLogFilePath() {
  const now = moment().tz('America/Sao_Paulo');
  const year = now.year();
  const month = String(now.month() + 1).padStart(2, '0');
  const day = String(now.date()).padStart(2, '0');
  const hour = String(now.hour()).padStart(2, '0');

  // Retorna o caminho completo do arquivo de log no formato: logs/YYYY_MM_DD_HH.log
  return path.join(process.cwd(), 'logs', `${year}_${month}_${day}_${hour}.log`);
}

/**
 * Garante que o diretório de logs exista. Se não existir, cria-o.
 */
function ensureLogDirectoryExists() {
  const logDirectory = path.join(process.cwd(), 'logs');
  console.log(`Caminho do diretório de logs: ${logDirectory}`);

  // Verifica se o diretório de logs existe; se não, cria o diretório e quaisquer diretórios pai necessários
  if (!fs.existsSync(logDirectory)) {
    console.log('Diretório de logs não existe. Criando...');
    try {
      fs.mkdirSync(logDirectory, { recursive: true });
      console.log('Diretório de logs criado com sucesso.');
    } catch (error) {
      console.error('Erro ao criar o diretório de logs:', error);
    }
  } else {
    console.log('Diretório de logs já existe.');
  }
}

/**
 * Registra uma mensagem em um arquivo de log com um tipo opcional.
 * @param {string} message - Mensagem a ser registrada.
 * @param {string} [type='info'] - Tipo da mensagem (por exemplo, 'info', 'error').
 */
function log(message, type = 'info') {
  // Garante que o diretório de logs exista
  ensureLogDirectoryExists();

  const logFilePath = getCurrentLogFilePath();

  // Se o caminho do arquivo de log mudou, feche o arquivo anterior (se houver) e atualize o caminho
  if (logFilePath !== currentLogFile) {
    if (currentLogFile) {
      try {
        fs.closeSync(fs.openSync(currentLogFile, 'w')); // Fecha o arquivo anterior
      } catch (error) {
        console.error('Erro ao fechar o arquivo de log anterior:', error);
      }
    }
    currentLogFile = logFilePath;
  }

  const timestamp = moment().tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  const logType = typeof type === 'string' ? type.toUpperCase() : 'INFO';
  const logMessage = `${timestamp} [${logType}]: ${message}\n`;

  try {
    // Anexa a mensagem de log ao arquivo de log
    fs.appendFileSync(currentLogFile, logMessage);
  } catch (error) {
    console.error('Erro ao escrever no arquivo de log:', error);
  }

  console.log(`${timestamp} [${logType}]: ${message}`);
}

// Exporta a função de log para que possa ser utilizada em outros módulos
module.exports = log;
