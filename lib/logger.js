const fs = require('fs'); // Módulo para operações de sistema de arquivos
const path = require('path'); // Módulo para manipulação de caminhos de arquivos
const moment = require('moment-timezone'); // Biblioteca para manipulação de datas e fusos horários

let currentLogFile = null; // Variável para armazenar o caminho do arquivo de log atual

/**
 * Gera o caminho completo do arquivo de log baseado na data e hora atuais.
 * @returns {string} Caminho completo do arquivo de log.
 */
function getCurrentLogFilePath() {
  // Obtém a data e hora atuais no fuso horário 'America/Sao_Paulo'
  const now = moment().tz('America/Sao_Paulo');
  const year = now.year(); // Ano atual
  const month = String(now.month() + 1).padStart(2, '0'); // Mês atual (0-indexado, então adiciona 1)
  const day = String(now.date()).padStart(2, '0'); // Dia atual
  const hour = String(now.hour()).padStart(2, '0'); // Hora atual
  
  // Retorna o caminho completo do arquivo de log no formato: logs/YYYY_MM_DD_HH.log
  return path.join(__dirname, `logs/${year}_${month}_${day}_${hour}.log`);
}

/**
 * Garante que o diretório de logs exista. Se não existir, cria-o.
 */
function ensureLogDirectoryExists() {
  // Obtém o caminho do diretório de logs
  const logDirectory = path.join(__dirname, 'logs');

  // Verifica se o diretório de logs existe; se não, cria o diretório e quaisquer diretórios pai necessários
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }
}

/**
 * Registra uma mensagem em um arquivo de log com um tipo opcional.
 * @param {string} message - Mensagem a ser registrada.
 * @param {string} [type='info'] - Tipo da mensagem (por exemplo, 'info', 'error').
 */
function log(message, type = 'info') {
  // Obtém o caminho completo do arquivo de log atual
  const logFilePath = getCurrentLogFilePath();

  // Garante que o diretório de logs exista
  ensureLogDirectoryExists();

  // Se o caminho do arquivo de log mudou, feche o arquivo anterior (se houver) e atualize o caminho
  if (logFilePath !== currentLogFile) {
    if (currentLogFile) {
      fs.closeSync(fs.openSync(currentLogFile, 'w')); // Fecha o arquivo anterior
    }
    currentLogFile = logFilePath; // Atualiza o caminho do arquivo de log atual
  }

  // Formata o timestamp atual para o formato: YYYY-MM-DDTHH:mm:ss.SSSZ
  const timestamp = moment().tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  
  // Determina o tipo de log, garantindo que esteja em maiúsculas
  const logType = typeof type === 'string' ? type.toUpperCase() : 'INFO';

  // Cria a mensagem de log com timestamp e tipo
  const logMessage = `${timestamp} [${logType}]: ${message}\n`;

  // Anexa a mensagem de log ao arquivo de log
  fs.appendFileSync(currentLogFile, logMessage);

  // Exibe a mensagem no console
  console.log(`${timestamp} [${logType}]: ${message}`); 
}

// Exporta a função de log para que possa ser utilizada em outros módulos
module.exports = log;
