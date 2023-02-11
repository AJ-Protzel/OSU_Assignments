const { DataTypes } = require('sequelize')
const sequelize = require('../lib/sequelize')
const Business = require('./business')
const Photo = require('./photo')
const Review = require('./review')

const User = sequelize.define('user', {
    userid: {type: DataTypes.STRING, allowNull: false}
})

User.hasMany(Business, {
    foreignKey: {allowNull: false},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
User.hasMany(Photo, {
    foreignKey: {allowNull: false},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
User.hasMany(Review, {
    foreignKey: {allowNull: false},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

Business.belongsTo(User)
Photo.belongsTo(User)
Review.belongsTo(User)

module.exports = User