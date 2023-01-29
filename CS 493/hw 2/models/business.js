const { DataTypes } = require('sequelize')
const sequelize = require('../lib/sequelize')
const Photo = require('./photo')
const Review = require('./review')

const Business = sequelize.define('business', {
    ownerid: {type: DataTypes.STRING, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    address: {type: DataTypes.STRING, allowNull: false},
    city: {type: DataTypes.STRING, allowNull: false},
    state: {type: DataTypes.STRING(2), allowNull: false},
    zip: {type: DataTypes.STRING(5), allowNull: false},
    phone: {type: DataTypes.STRING(10), allowNull: false},
    category: {type: DataTypes.TEXT, allowNull: false},
    subcategory: {type: DataTypes.TEXT, allowNull: false},
    website: {type: DataTypes.STRING, allowNull: true},
    email: {type: DataTypes.STRING, allowNull: true}
})

Business.hasMany(Photo, {
    foreignKey: {allowNull: false},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Business.hasMany(Review, {
    foreignKey: {allowNull: false},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

Photo.belongsTo(Business)
Review.belongsTo(Business)

module.exports = Business