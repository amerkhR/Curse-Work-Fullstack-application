const { authJwt } = require("../middleware");
const controller = require("../controllers/review.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    next();
  });

  app.post("/api/reviews", [authJwt.verifyToken], controller.createReview);

  app.get("/api/reviews/company/:companyId", controller.getCompanyReviews);

  app.delete(
    "/api/reviews/:id",
    [authJwt.verifyToken],
    controller.deleteReview
  );
};
