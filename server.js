const express = require('express')
const app = express();
const methodOverride = require('method-override')
const path = require('path')
const db = require('./db')
const sequelize = db.sequelize;
const Customer = db.Customer;
const Order = db.Order;


app.use('/public', express.static(path.join(__dirname,'public')));

app.use(express.urlencoded( {extended: false}));
app.get('/', (req, res) => res.redirect('/customers'));
app.use(methodOverride('_method'));

app.use('/customers', require('./customers.routes'));
app.use('/orders', require ('./orders.routes'));


const start = async () => {
    try{

await sequelize.sync({force: true});  

const crab = await Order.create({ name: 'Coconut Crab Curry'});
const fish = await Order.create({ name: 'Steamed Fish with Thai Herbs' });
const salad = await Order.create({ name: 'Fried Fish with Garden Herb Salad'});
const curry = await Order.create({ name: 'Green Curry'});
 
 await Customer.create({name: 'Carmen', orderId: crab.id});
 await Customer.create({name: 'Irvin', orderId: fish.id});
 await Customer.create({name: 'Tiffany', orderId: fish.id});
 await Customer.create({name: 'Ice', orderId: salad.id});
 await Customer.create({name: 'Fred', orderId: curry.id});
 await Customer.create({name: 'Kenny', orderId: crab.id });
  

 console.log('starting..')
 const port = process.env.PORT || 3000
 app.listen(port, ()=> console.log(`app listening on port ${port}`));
    }
    catch(ex){
        console.log(ex)
    }
}

start();













