# Используем базовый образ с Node.js
FROM node:14-alpine

# Установка директории приложения в контейнере
WORKDIR /app

# Копирование зависимостей и установка их
COPY package*.json ./
RUN npm install

# Копирование остальных файлов приложения
COPY . .

# Сборка приложения
RUN npm run build

# Команда для запуска сервера React
CMD ["npm", "start"]
