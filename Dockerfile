# Usa una imagen base oficial de Node.js
FROM node:18

# Crea y establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código fuente
COPY . .

# Expone el puerto en el que corre tu app
EXPOSE 5001

# Comando para iniciar la app
CMD ["node", "index.js"]
