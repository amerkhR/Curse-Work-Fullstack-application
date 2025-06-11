module.exports = (sequelize, Sequelize) => {
  const Review = sequelize.define("review", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: Sequelize.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 5,
      },
    },
    text: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    companyId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return Review;
};
