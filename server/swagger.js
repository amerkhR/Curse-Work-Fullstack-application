const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Опции для Swagger
const options = {
  definition: {
    openapi: "3.0.0", // Версия OpenAPI
    info: {
      title: "My Awesome API", // Название API
      version: "1.0.0", // Версия API
      description: "API для управления пользователями и продуктами", // Описание API
    },
    servers: [
      {
        url: "http://localhost:8080", // Базовый URL вашего сервера
      },
    ],
  },
  apis: ["./routes/*.js"], // Путь к файлам, где описаны маршруты
};

// Генерация спецификации Swagger
const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  // Подключение Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
