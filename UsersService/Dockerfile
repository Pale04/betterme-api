FROM node:latest
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Expone el puerto que tu API usa (ajústalo si es distinto)
EXPOSE 6969

# Comando para ejecutar tu app (ajusta si no es src/index.js)
CMD ["npm", "run", "deploy"]