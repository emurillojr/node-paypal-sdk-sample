const express = require('express');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');

//Create config options, with parameters (mode, client_id, secret).
//add client secret and id
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AeaaADuOJ04mXDHXeMjOIPa7YaiyK30tECJAgXqAZjg0P00B3IbpW1GXBou1CZOJQYr8ukXCCRYDL8ok',
  'client_secret': 'EIswwhJs9DIUfQBYPjvjXLuysu8UfgDsj_3JSNiIWzHjjoHMxx6689I4YicnVjT3P6HkuyknU4pxlM67'
});

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));

//Invoke the rest api (eg: create a PayPal payment) with required parameters (eg: data, config_options, callback).
// create the pay route that the form is being submitted to
app.post('/pay', (req, res) => {

  const create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "http://localhost:3000/success",
      "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [
      {
        "item_list": {
          "items": [
            {
              "name": "Red Sox Hat",
              "sku": "001",
              "price": "25.00",
              "currency": "USD",
              "quantity": 1
            }
          ]
        },
        "amount": {
          "currency": "USD",
          "total": "25.00"
        },
        "description": "Hat for best team ever."
      }
    ]
  };

  paypal.payment.create(create_payment_json, function(error, payment) {
    if (error) {
      throw error;
    } else {
      // console.log("Create Payment Response");
      // console.log(payment);
      // res.send('test');

      // look through links array, find approval url, send the user to approval url
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.redirect(payment.links[i].href);
        }
      }

    }
  });

});

app.listen(3000, () => console.log('Server Started'));
