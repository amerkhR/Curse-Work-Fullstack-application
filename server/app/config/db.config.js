module.exports = {
  HOST: "localhost",
  PORT: "5432",
  USER: "postgres",
  PASSWORD: "root",
  DB: "mirea",
  dialect: "postgres",
  pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
}