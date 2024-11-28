const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/PetSuppliesDB'); // Removed deprecated options
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
