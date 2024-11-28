const express = require('express');
const mongoose = require('mongoose'); 
const router = express.Router();
const Product = require('../models/product');
const multer = require('multer');
const path = require('path');

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('category_id', 'name description');
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images')); // Store files in public/images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    }
});

const upload = multer({ storage });

// POST new product
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, stock, category_id } = req.body;

        if (!name || !description || !price || !category_id) {
            return res.status(400).json({ error: 'Name, description, price, and category are required.' });
        }

        const product = new Product({
            name,
            description,
            price,
            stock: stock || 0,
            category_id,
            images: req.file ? [`/images/${req.file.filename}`] : [] // Use uploaded file if provided
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error('Error saving product:', err.message);
        res.status(400).json({ error: 'Failed to create product', details: err.message });
    }
});


// PUT (update) product
// PUT (update) product
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, stock, category_id } = req.body;

        if (!name || !description || !price || !category_id) {
            return res.status(400).json({ error: 'Name, description, price, and category are required.' });
        }

        const updatedFields = {
            name,
            description,
            price,
            stock: stock || 0,
            category_id
        };

        // If an image is uploaded, include it in the update
        if (req.file) {
            updatedFields.images = [`/images/${req.file.filename}`];
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (err) {
        console.error('Error updating product:', err.message);
        res.status(400).json({ error: 'Failed to update product', details: err.message });
    }
});


// DELETE product
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

module.exports = router;
