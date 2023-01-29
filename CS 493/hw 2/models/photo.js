const { DataTypes } = require('sequelize')
const sequelize = require('../lib/sequelize')

const Photo = sequelize.define('photo', {
    userid: {type: DataTypes.STRING, allowNull: false},
    photoid: {type: DataTypes.STRING, allowNull: false},
    caption: {type: DataTypes.TEXT, allowNull: true}
})

module.exports = Photo