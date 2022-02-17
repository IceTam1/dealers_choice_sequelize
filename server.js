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
         <li> ${customer.name} </li>
       
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
       <link rel = 'stylesheet' href='/public/style.css'/> 
        <title> Customer Orders </title>
       </head>
       <body>
      
          <h1 class='header'> All Orders at Fish Cheeks Restaurant </h1>
          <div class='form'>
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
           <button class='button'> Add Order </button>
          </form>
          </div>
           <ul class='list'>
           
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
    <button class='button2'> Order Completed </button>
    </form>
    </div>


    `;
}).join('');


res.send(`
 <html>
   <head> 
    <link rel = 'stylesheet' href='/public/style.css'/> 
    <title> Fish Cheeks Orders </title>
   </head>
   <body>
     
      <h1 class='header'> Order Fulfillment </h1>
      <a class='link' href= '/customers'> < Full List of Orders </a>
       <h1 class='name'>
        ${orders.name}
        </h1>
        <div class='order2'>
       ${html}
       </div>
     
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













