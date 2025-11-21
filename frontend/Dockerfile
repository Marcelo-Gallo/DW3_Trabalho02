# Usa a mesma imagem base para consistência
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia o package.json e instala as dependências (incluindo EJS, axios, etc.)
COPY package*.json ./
RUN npm install

# Copia o restante do código (incluindo views, public, apps)
COPY . .

# Expõe a porta que o app.js usa (40100)
EXPOSE 40100

# Comando para iniciar o servidor
CMD [ "node", "app.js" ]