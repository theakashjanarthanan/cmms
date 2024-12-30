// backend\routes\preventiveMaintenanceRoutes.js
const express = require('express');
const router = express.Router();
const PreventiveMaintenance = require('../models/PreventiveMaintenance');

// CREATE: Add a new preventive maintenance task
router.post('/', async (req, res) => {
    try {
        const { title, description, dueDate, priority, status, frequency } = req.body;
        const task = new PreventiveMaintenance({
            title,
            description,
            dueDate,
            priority,
            status,
            frequency
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: 'Failed to create task', error: err });
    }
});

// READ: Get all preventive maintenance tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await PreventiveMaintenance.find();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(400).json({ message: 'Failed to get tasks', error: err });
    }
});

// UPDATE: Edit an existing preventive maintenance task
router.put('/:id', async (req, res) => {
    try {
        const { title, description, dueDate, priority, status, frequency } = req.body;
        const task = await PreventiveMaintenance.findByIdAndUpdate(
            req.params.id,
            { title, description, dueDate, priority, status, frequency },
            { new: true }
        );
        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({ message: 'Failed to update task', error: err });
    }
});

// DELETE: Delete a preventive maintenance task
router.delete('/:id', async (req, res) => {
    try {
        await PreventiveMaintenance.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Task deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Failed to delete task', error: err });
    }
});

module.exports = router;
