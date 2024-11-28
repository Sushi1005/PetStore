const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// POST new user
router.post('/', async (req, res) => {
    try {
        const { name, email, password, role, address } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, Email, and Password are required.' });
        }

        const newUser = new User({ name, email, password, role, address });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        console.error('Error creating user:', err.message);
        res.status(400).json({ error: 'Failed to create user' });
    }
});

// PUT (update) user
router.put('/:id', async (req, res) => {
    try {
        const { name, email, role, address } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and Email are required.' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role, address },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        console.error('Error updating user:', err.message);
        res.status(400).json({ error: 'Failed to update user' });
    }
});

// DELETE user
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully.' });
    } catch (err) {
        console.error('Error deleting user:', err.message);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
