module.exports = (sequelize, Sequelize) => {
  const Vacancy = sequelize.define(
    "vacancies",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      company: {
        type: Sequelize.STRING,
      },
      salary: {
        type: Sequelize.STRING,
      },
      experience: {
        type: Sequelize.STRING,
        defaultValue: "Не имеет значения",
      },
      workFormat: {
        type: Sequelize.STRING,
        defaultValue: "полный день",
      },
      schedule: {
        type: Sequelize.STRING,
        defaultValue: "5/2",
      },
      accessibility: {
        type: Sequelize.STRING,
        defaultValue: "нет",
      },
      responsibilities: {
        type: Sequelize.TEXT,
      },
      requirements: {
        type: Sequelize.TEXT,
      },
      conditions: {
        type: Sequelize.TEXT,
      },
      isFavorite: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    { timestamps: false }
  );

  return Vacancy;
};
