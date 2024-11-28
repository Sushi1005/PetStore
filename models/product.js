const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }, 
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [String] 
});

module.exports = mongoose.model('Product', ProductSchema);
