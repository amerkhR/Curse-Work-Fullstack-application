const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  port: config.PORT,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.agr = require("../models/agr.model.js")(sequelize, Sequelize);
db.vacancy = require("../models/vacancy.model.js")(sequelize, Sequelize);
db.help = require("../models/help.model.js")(sequelize, Sequelize);
db.vac_response = require("../models/vac_response.model.js")(
  sequelize,
  Sequelize
);
db.review = require("../models/review.model.js")(sequelize, Sequelize);
db.company = require("../models/company.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
});

db.ROLES = ["user", "admin", "moderator"];

db.vacancy.hasOne(db.vac_response, {
  foreignKey: "id",
  onDelete: "CASCADE",
});

db.review.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

db.review.belongsTo(db.company, {
  foreignKey: "companyId",
  as: "company",
});

db.user.hasMany(db.review, {
  foreignKey: "userId",
  as: "reviews",
});

db.company.hasMany(db.review, {
  foreignKey: "companyId",
  as: "reviews",
});

module.exports = db;
