module.exports = (sequelize, Sequelize) => {
  const Vacancy = sequelize.define("vacancies", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING
    },
    company: {
      type: Sequelize.STRING
    },
    salary: {
      type: Sequelize.STRING
    },
    isFavorite: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }

  }, {timestamps: false});

  return Vacancy;
}