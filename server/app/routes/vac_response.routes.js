const controller = require("../controllers/vac_response.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'multipart/form-data');
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/test/vac_response",
    controller.uploadVacRes
  )
}