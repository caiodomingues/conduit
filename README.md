# Conduit

O Conduit é uma aplicação de testes que tenta simular uma aplicação próxima do que seria visto no mundo real. Por meio dele, cria-se um "clone" do site [Medium](https://medium.com), controlando Artigos, Tags, Comentários e Perfis. A interface foi construída utilizando o framework [ReactJS](https://reactjs.org/), StyledComponents, Axios, ReactModal, ReactMarkdown e Typescript.

O desafio original pode ser visto [neste repositório](https://github.com/gothinkster/realworld). Um exemplo prático da aplicação pode ser visto no [próprio site do RealWorld](https://demo.realworld.io/)

## Configurando

Para executarmos a aplicação, será necessário ter NodeJS instalado no computador. Após clonar o repositório, instale os pacotes necessários com o NPM (ou Yarn, se preferir):

```bash
npm install

ou

yarn
```

Para iniciar o projeto, basta utilizar o comando:

```bash
npm run start

ou

yarn start
```

O aplicativo irá iniciar no modo desenvolvimento. Normalmente, a aplicação abrirá automaticamente no seu navegador padrão, caso isto não ocorra, abra o [http://localhost:3000](http://localhost:3000) no seu browser.

### API

Por padrão, a aplicação utiliza o [backend](https://github.com/gothinkster/realworld/tree/master/api) disponibilizado pelo próprio desafio.
