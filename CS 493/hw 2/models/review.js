const { DataTypes } = require('sequelize')
const sequelize = require('../lib/sequelize')

const Review = sequelize.define('review', {
    userid: {type: DataTypes.STRING, allowNull: false},
    reviewid: {type: DataTypes.STRING, allowNull: false},
    dollars: {type: DataTypes.FLOAT, allowNull: false},
    stars: {type: DataTypes.STRING, allowNull: false},
    review: {type: DataTypes.TEXT, allowNull: true}
})

module.exports = Review