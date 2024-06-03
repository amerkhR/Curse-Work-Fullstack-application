module.exports = (sequelize, Sequelize) => {
    const Help = sequelize.define("help", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING
      },
      contact: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      }
    }, {timestamps: false});
  
    return Help;
  };
  