# LogPulse

**LogPulse** é um pacote simples para registro de logs em arquivos, com suporte para diferentes tipos de log e formatação de timestamp.

## Instalação

Para instalar o **LogPulse** via npm, execute o seguinte comando:

```bash
npm install log-pulse
```

## Uso

Depois de instalar o pacote, você pode usá-lo em seu código Node.js para registrar mensagens de log. Aqui está um exemplo básico:

```javascript
const log = require('log-pulse');

// Registrar uma mensagem de log de informação
log('Esta é uma mensagem de informação');

// Registrar uma mensagem de log de erro
log('Esta é uma mensagem de erro', 'error');
```

### Estrutura do Log

O arquivo de log será criado na pasta `logs/` com um nome baseado na data e hora atuais, no formato `YYYY_MM_DD_HH.log`. As mensagens de log serão gravadas nesse arquivo.

## Configuração do Tempo

O pacote usa o fuso horário **America/Sao_Paulo** para gerar timestamps. Caso queira alterar o fuso horário, edite a função `getCurrentLogFilePath` no código fonte.

## Testes

Para garantir que o seu logger está funcionando conforme o esperado, você pode adicionar testes. Recomendamos o uso do Jest para testes. Veja como configurá-lo:

1. Instale o Jest como uma dependência de desenvolvimento:

   ```bash
   npm install --save-dev jest
   ```

2. Adicione um script de teste no seu `package.json`:

   ```json
   "scripts": {
     "test": "jest"
   }
   ```

3. Crie um arquivo de teste, por exemplo, `test/logger.test.js`, com o seguinte conteúdo:

   ```javascript
   const fs = require('fs');
   const path = require('path');
   const log = require('../lib/logger');
   const moment = require('moment-timezone');

   test('deve registrar mensagens corretamente', () => {
     const message = 'Mensagem de teste';
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
   ```

4. Execute os testes com o comando:

   ```bash
   npm test
   ```

## Contribuição

Se você deseja contribuir com o **LogPulse**, sinta-se à vontade para abrir uma issue ou enviar um pull request no [repositório do GitHub](https://github.com/otaciobarbosa/log-pulse). Seu feedback e contribuições são bem-vindos!

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

Para dúvidas, sugestões ou outras questões, você pode me encontrar no [GitHub](https://github.com/otaciobarbosa). Sinta-se à vontade para abrir uma issue ou entrar em contato diretamente.
