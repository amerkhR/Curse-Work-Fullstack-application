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
      company_description: {
        type: Sequelize.TEXT,
        allowNull: true,
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
      video_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    { timestamps: false }
  );

  return Vacancy;
};
