module.exports = (sequelize, Sequelize) => {
    const Vac_responce = sequelize.define("vac_responses", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      vacancy_id: {
        type: Sequelize.INTEGER
      },

      contact: {
        type: Sequelize.STRING
      },
      
      message: {
        type: Sequelize.STRING,
      },

      resume: {
        type: Sequelize.BLOB('long')
      }
  
    }, {timestamps: false});
  
    return Vac_responce;
  }