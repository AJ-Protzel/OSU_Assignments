const { DataTypes } = require('sequelize')

const { Business } = require('./business')
const { Photo } = require('./photo')
const { Review } = require('./review')

const sequelize = require('../lib/sequelize')

/*
 * Schema for a User.
 */
const User = sequelize.define('user', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    admin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
})

User.hasMany(Business, { foreignKey: { allowNull: false } })
Business.belongsTo(User)

User.hasMany(Photo, { foreignKey: { allowNull: false } })
Photo.belongsTo(User)

User.hasMany(Review, { foreignKey: { allowNull: false } })
Review.belongsTo(User)

exports.User = User

exports.UserClientFields = [
    'name',
    'email',
    'password',
    'admin'
  ]