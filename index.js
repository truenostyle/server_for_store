const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const { ObjectId } = require('bson');

const PORT = 9120;
const MONGODB_URI = 'mongodb+srv://trueno:uldsof4WZYZmNmId@cluster0.eqzohtz.mongodb.net/Project?retryWrites=true&w=majority';


mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch(error => console.error(error));

  const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    urlImage: String,
    description: String,
  });
  
  const Product = mongoose.model('Product', productSchema, 'Products');
  

  const commentSchema = new mongoose.Schema({
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    },
    name: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
  }, { timestamps: true });
  
  const Comment = mongoose.model('Comment', commentSchema);



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static('dist/shop'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Method', 'GET, POST');
  next();
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/shop', 'index.html'));
});

app.get('/generate_id', async (req, res) => {
  try {
    const new_id = new ObjectId();
    res.send(new_id);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.send(product);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.send(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});



app.post('/products', async (req, res) => {
  const { _id, name, price, urlImage, description } = req.body;
  const product = new Product({ _id, name, price, urlImage, description });
  try {
    await product.save();
    res.send('Product added successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/comments', async (req, res) => {
  const { name, text, productId} = req.body;
  const comment = new Comment({ name, text, productId});
  try {
    await comment.save();
    res.send('Comment added successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
