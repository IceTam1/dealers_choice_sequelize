const express = require('express')
const path = require('path')
const db = require('./db')

const Customer = db.Customer;
const Order = db.Order;
const app = require('express').Router();

module.exports = app;

app.use('/public', express.static(path.join(__dirname,'public')));



app.delete('/:id', async (req, res, next) => {
   const customer = await Customer.findByPk(req.params.id);
   await customer.destroy();
     res.redirect(`/orders/${customer.orderId}`)
})

app.post('/', async (req, res, next) => {
   try {
     const customer = await Customer.create(req.body);
     res.redirect(`/orders/${customer.orderId}`) 
   }
   catch (ex){
      next(ex)
   }
});

app.get('/', async (req, res, next) => {
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






