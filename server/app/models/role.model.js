module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("roles", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: false,
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
  });

  return Role;
};
