const { authJwt } = require("../middleware");
const controller = require("../controllers/profile.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Получение профиля
  app.get("/api/test/profile", [authJwt.verifyToken], controller.getProfile);

  // Обновление профиля
  app.put("/api/test/profile", [authJwt.verifyToken], controller.updateProfile);

  // Загрузка фото профиля
  app.post(
    "/api/test/profile/photo",
    [authJwt.verifyToken],
    controller.uploadPhoto
  );

  // Обновление предпочтений
  app.put(
    "/api/test/profile/preferences",
    [authJwt.verifyToken],
    controller.updatePreferences
  );
};
