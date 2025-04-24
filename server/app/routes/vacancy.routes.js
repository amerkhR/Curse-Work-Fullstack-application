const { authJwt } = require("../middleware");
const controller = require("../controllers/vacancy.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/vacancies", controller.showVac);

  app.post("/api/test/vacancies", controller.createVac);

  app.delete("/api/test/vacancies/:id", controller.deleteVac);

  app.put("/api/test/favorites/:id", controller.favoriteVac);

  app.get("/api/test/vacancies/:id", controller.getVacancyById);
};
