<p align="center">
  <a href="https://pt-br.rocket.chat/" target="blank"><img src="https://4linux.com.br/consultoria/wp-content/uploads/sites/3/2020/11/Logo_Horizontal_-_Red.png" width="240" alt="Rocketchat Logo" /></a>
  <a href="https://www.zenvia.com/" target="blank"><img src="https://i0.wp.com/www.zenvia.com/wp-content/uploads/2021/04/logo-white-1.png" width="280" alt="Zenvia Logo" /></a>
  <a href="https://www.zenvia.com/" target="blank"><img src="https://i.ibb.co/1fT2Nt3/whatsapp-logo.png" width="220" alt="Whatsapp Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Comunicação via Webhooks entre o Rocketchat e Zenvia.</p>
    <p align="center">
  
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="20%" alt="Nest Logo" /></a>
  <a href="https://redis.io/" target="blank"><img src="https://i.ibb.co/GsDvdXt/redis.png" width="20%" alt="Redis Logo" /></a>
  
</p>
  
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Descrição

Um projeto desenvolvido em [Nest](https://github.com/nestjs/nest) para envio de mensagens via Webhook do Rocketchat para o Whatsapp, usando a Zenvia como Broker.

## Instalação

```bash
$ npm install
```

## Executando a aplicação

- Faça uma cópia do arquivo .env.example substituindo os valores das variáveis de ambiente conforme descrito no arquivo.
- Para fazer uma gestão eficiente das mensagens enviadas e evitar possíveis duplicidades de envio, o projeto usa o [Redis](https://redis.io/) para criar um cache das mensagens enviadas. Assim, caso o ID da mensagem esteja na cache, ela não será enviada.
- Para facilitar o deploy do projeto, foi incluso o arquivo docker-compose.yml que permite subir um container com o Redis usando [Docker](https://www.docker.com/). Para isso, apenas execute caso deseje subir somente o Redis:

```bash
$ docker-compose up -d redis
```

- O projeto também pode ser executado interamente usando docker. Basta executar o comando abaixo:

```bash
$ docker-compose up -d
```

- Caso deseje executar o projeto localmente para fins de desenvolvimento ou teste, você pode subir somente o Redis, usar um que já esteja disponível, configurar o arquivo .env apontando para o seu Redis e subir o projeto utilizando os comandos abaixo:

```bash
#Para executar em watch mode
$ npm run start:dev
```

Ou

```bash
#Para executar em production mode
$ npm run start:prod
```

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
