const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory data store (instead of database for simplicity)
const products = [
  {
    id: '1',
    name: 'Naruto Manga Volume 1',
    category: 'manga',
    price: 499,
    image: '/images/naruto-vol-1.jpeg',
    description: 'The first volume of the popular Naruto manga series.'
  },
  {
    id: '2',
    name: 'One Piece Poster',
    category: 'poster',
    price: 249,
    image: '/images/one-piece-poster.jpg',
    description: 'High-quality One Piece anime poster featuring the Straw Hat crew.'
  },
  {
    id: '3',
    name: 'Attack on Titan Hoodie',
    category: 'clothing',
    price: 1499,
    image: '/images/aot-hoodie.jpg',
    description: 'Comfortable Attack on Titan themed hoodie with Survey Corps logo.'
  },
  {
    id: '4',
    name: 'My Hero Academia T-Shirt',
    category: 'clothing',
    price: 999,
    image: '/images/mha-tshirt.jpg',
    description: 'Cotton t-shirt featuring the heroes from My Hero Academia.'
  },
  {
    id: '5',
    name: 'Demon Slayer Manga Box Set',
    category: 'manga',
    price: 2099,
    image: '/images/demon-slayer-manga.jpg',
    description: 'Complete box set of Demon Slayer manga volumes 1-5.'
  },
  {
    id: '6',
    name: 'Dragon Ball Z Poster',
    category: 'poster',
    price: 349,
    image: '/images/dbz-poster.jpg',
    description: 'Vibrant Dragon Ball Z poster featuring Goku and friends.'
  }
];

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware for cart functionality
app.use(session({
  secret: uuidv4(),
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // 1 hour
}));

// Initialize cart in session
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

// Routes

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Get products by category
app.get('/api/products/category/:category', (req, res) => {
  const category = req.params.category;
  const filteredProducts = products.filter(product => product.category === category);
  res.json(filteredProducts);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// Get cart
app.get('/api/cart', (req, res) => {
  res.json(req.session.cart);
});

// Add to cart
app.post('/api/cart', (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  // Check if product already in cart
  const existingItem = req.session.cart.find(item => item.product.id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    req.session.cart.push({
      product,
      quantity: quantity || 1
    });
  }
  
  res.json(req.session.cart);
});

// Update cart item
app.put('/api/cart/:productId', (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  
  const itemIndex = req.session.cart.findIndex(item => item.product.id === productId);
  
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }
  
  if (quantity <= 0) {
    // Remove item if quantity is 0 or negative
    req.session.cart.splice(itemIndex, 1);
  } else {
    // Update quantity
    req.session.cart[itemIndex].quantity = quantity;
  }
  
  res.json(req.session.cart);
});

// Remove from cart
app.delete('/api/cart/:productId', (req, res) => {
  const { productId } = req.params;
  
  const itemIndex = req.session.cart.findIndex(item => item.product.id === productId);
  
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }
  
  req.session.cart.splice(itemIndex, 1);
  res.json(req.session.cart);
});

// Checkout route
app.post('/api/checkout', (req, res) => {
  // In a real application, this would process payment and create an order in the database
  const { name, email, address } = req.body;
  
  if (!name || !email || !address) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  
  const order = {
    id: uuidv4(),
    items: req.session.cart,
    customer: { name, email, address },
    total: req.session.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    date: new Date()
  };
  
  // Clear the cart after checkout
  req.session.cart = [];
  
  res.json({ success: true, order });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});