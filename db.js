const Sequelize = require('sequelize')
const sequelize = new Sequelize (process.env.DATABASE_URL || 'postgres://localhost/restaurants_db', {logging:false})
const STRING = Sequelize.DataTypes.STRING

const Customer = sequelize.define('customer', {
    name: {
        type: STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});

const Order = sequelize.define('order', {
    name: {
        type: STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});

Customer.belongsTo(Order)
Order.hasMany(Customer)


module.exports = {
    Customer,
    Order,
    sequelize
}