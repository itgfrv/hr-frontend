# Используем базовый образ с Node.js
FROM node:18-alpine

# Установка директории приложения в контейнере
WORKDIR /app

# Копирование зависимостей и установка их
COPY package*.json ./
RUN npm cache clean --force && npm install --legacy-peer-deps

# Копирование остальных файлов приложения
COPY . .

# Сборка приложения
RUN npm run build

# Команда для запуска сервера React
CMD ["npm", "start"]
