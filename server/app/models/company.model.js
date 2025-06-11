module.exports = (sequelize, Sequelize) => {
  const Company = sequelize.define("company", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    logo: {
      type: Sequelize.STRING,
    },
    website: {
      type: Sequelize.STRING,
    },
    location: {
      type: Sequelize.STRING,
    },
  });

  return Company;
};
