const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/contactDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.static(__dirname + '/public'));
const indexRouter = require('./routes/index.js');
app.use('/', indexRouter);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Define a schema
const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  message: { type: String, required: true },
});

// Create a model
const Form = mongoose.model('Form', formSchema);

// Route to render the contact form
app.get('/contact', (req, res) => {
  const successMessage = req.query.success === 'true' ? 'Form successfully submitted!' : null;
  res.render('contact', { successMessage });
});

  


// Handle the form submission
app.post('/contact', (req, res) => {
  const formData = new Form({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
  });

  formData
    .save()
    .then(() => {
      console.log('Form data saved successfully'); 
      
      res.redirect('/contact?success=true')}
    )
    .catch((err) => {
      console.error('Error saving data:', err);
      res.status(400).render('error', { message: 'Error saving data. Please try again.' });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
