const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String
}, { versionKey: false });

module.exports = mongoose.model('Category', CategorySchema);
