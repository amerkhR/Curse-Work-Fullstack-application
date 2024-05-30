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
    salary: {
      type: Sequelize.STRING
    }

  }, {timestamps: false});

  return Vacancy;
}