const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/restaurants_db')









const start = async () => {
  await sequelize.sync() 

  console.log('hello')

}

start();