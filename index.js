const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const Publishable_Key = 'Your_Publishable_Key';
const Secret_Key = 'Your_Secret_Key';

const stripe = require('stripe')(Secret_Key);

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('Home', {
    key: Publishable_Key
  });
});

app.post('/payment', function (req, res) {
  // Moreover, you can take more details from the user
  // like Address, Name, etc from the form
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: 'Test User',
      address: {
        line1: 'abc',
        postal_code: '452331',
        city: 'test',
        state: 'test',
        country: 'test'
      }
    })
    .then((customer) => {
      return stripe.charges.create({
        amount: 25000,
        description: 'Web Development Product',
        currency: 'USD',
        customer: customer.id
      });
    })
    .then((charge) => {
      res.send('Success'); // If no error occurs
    })
    .catch((err) => {
      res.send(err); // If some error occurs
    });
});

app.listen(port, function (error) {
  if (error) throw error;
  console.log('Server created successfully');
});
