const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');


const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());

// Serve static files for views, scripts, and images
app.use(express.static(path.join(__dirname, 'views')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);


// Default routes for frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'products.html'));
});

app.get('/orders', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'orders.html'));
});
app.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'users.html'));
});
app.get('/categories', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'categories.html'));
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
