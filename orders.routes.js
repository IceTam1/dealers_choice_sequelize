const express = require('express')
const path = require('path')
const db = require('./db')
const Customer = db.Customer;
const Order = db.Order;
const app = require('express').Router();

module.exports = app;


app.use('/public', express.static(path.join(__dirname,'public')));

app.get('/:id', async(req, res, next) => {
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


