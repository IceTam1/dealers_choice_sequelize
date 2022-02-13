const Sequelize = require('sequelize')
const sequelize = new Sequelize (process.env.DATABASE_URL || 'postgres://localhost/restaurants_db')
const STRING = Sequelize.DataTypes.STRING

const Customer = sequelize.define('customer', {
    name: {
        type: STRING,
        unique: true,
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






const express = require('express')
const app = express();
const methodOverride = require('method-override')

app.use(express.urlencoded( {extended: false}));
app.get('/', (req, res) => res.redirect('/customers'));
app.use(methodOverride('_method'));

app.delete('/customers/:id', async (req, res, next) => {
   const customer = await Customer.findByPk(req.params.id);
   await customer.destroy();
     res.redirect(`/orders/${customer.orderId}`)
})

app.post('/customers', async (req, res, next) => {
   try {
     const customer = await Customer.create(req.body);
     res.redirect(`/orders/${customer.orderId}`) 
   }
   catch (ex){
      next(ex)
   }
});

app.get('/customers', async (req, res, next) => {
  try {
    const customers = await Customer.findAll({
        include: [ Order ]
    })   

    const orders = await Order.findAll();
    
    const html = customers.map( customer=> {
        return `
        <div>
         <ul>
         <li> ${customer.name}
       
         <div>
          <a href= '/orders/${customer.orderId}'> ${customer.order.name} </a>
          </div>
          </li>
          </ul>
        </div>
        `;
    }).join('');

   res.send(`
     <html>
       <head> 
        <title> Customer Orders </title>
       </head>
       <body>
      
          <h1> All Orders at Fish Cheeks Restaurant </h1>
          <form method='POST'>

          <input name='name' placeholder='Customer Name' />
          <select name='orderId'>
           ${
              orders.map( order => {
                 return `
                  <option value='${order.id}'> ${order.name}</option>
                 `
              } ).join('')
           }

           </select>
           <button> Add Order </button>
          </form>

           <ul>
           
           ${html}
            
         </ul>
       </body>
     </html>
   `)

  }
  catch (ex) {
    next(ex)
  }
});


app.get('/orders/:id', async(req, res, next) => {
  try {
    const orders = await Order.findByPk(req.params.id, {
      include: [ Customer ]
   });

   const html = orders.customers.map( customer=> {
    return `
    <div>
    <ul>
      <li>  ${customer.name} </li>
    </ul>
    <form method='POST' action='/customers/${customer.id}?_method=delete'>
    <button> Order Completed </button>
    </form>
    </div>


    `;
}).join('');


res.send(`
 <html>
   <head> 
    <title> Fish Cheeks Orders </title>
   </head>
   <body>
     <ul>
      <h1> Order Fulfillment </h1>
      <a href= '/customers'>Back to List of Orders</a>
       <h1>
        ${orders.name}
        </h2>
       ${html}
     </ul>
   </body>
 </html>
`)

}
  catch (ex) {
    next(ex)
  }


});







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













