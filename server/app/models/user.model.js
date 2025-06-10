module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      username: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      first_name: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      last_name: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      photo: {
        type: Sequelize.TEXT,
        defaultValue: "",
      },
      photo_path: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      preferred_salary: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      preferred_experience: {
        type: Sequelize.STRING,
        defaultValue: "Не имеет значения",
      },
      preferred_work_format: {
        type: Sequelize.STRING,
        defaultValue: "полный день",
      },
      preferred_schedule: {
        type: Sequelize.STRING,
        defaultValue: "5/2",
      },
      preferred_accessibility: {
        type: Sequelize.STRING,
        defaultValue: "нет",
      },
    },
    { timestamps: false }
  );

  return User;
};
