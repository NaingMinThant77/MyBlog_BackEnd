const Sequelize = require("sequelize"); //Upperletter is class-based

const sequelize = new Sequelize("blog", "root", "marco123", {
    host: "localhost",
    dialect: "mysql"
});

module.exports = sequelize;