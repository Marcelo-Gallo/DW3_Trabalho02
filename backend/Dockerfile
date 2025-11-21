# Usa a imagem oficial do Node (versão LTS recomendada)
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia o package.json e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta que o app.js usa (40000)
EXPOSE 40000

# Comando para iniciar o servidor
CMD [ "node", "app.js" ]