// export MYSQL_DB_NAME=hw2-db
// export MYSQL_USER=root
// export MYSQL_PASSWORD=admin123
// export MYSQL_HOST=localhost

const { Sequelize } = require('sequelize')
const sequelize = new Sequelize({
    // dialect: 'mysql',
    // host: process.env.MYSQL_HOST || 'localhost',
    // port: process.env.MYSQL_PORT || 3306,
    // database: process.env.MYSQL_DB_NAME,
    // username: process.env.MYSQL_USER,
    // password: process.env.MYSQL_PASSWORD

    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'hw2-db',
    username: 'root',
    password: 'admin123'
})

module.exports = sequelize