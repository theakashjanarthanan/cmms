// backend\routes\workOrders.js

const express = require('express');
const WorkOrder = require('../models/workOrderModel');
const router = express.Router();

// CREATE - Create a new work order
router.post('/', async (req, res) => {
    const { title, description, priority, status } = req.body;
    try {
        const workOrder = new WorkOrder({ title, description, priority, status });
        await workOrder.save();
        res.status(201).json({ message: 'Work Order Created Successfully!', workOrder });
    } catch (err) {
        res.status(400).json({ message: 'Failed to create work order.', error: err.message });
    }
});

// READ - Get all work orders
router.get('/', async (req, res) => {
    try {
        const workOrders = await WorkOrder.find();
        res.status(200).json(workOrders);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch work orders.', error: err.message });
    }
});

// Update Work Order
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, priority, status, dueDate } = req.body;
  
    try {
      const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(
        id,
        { title, description, priority, status, dueDate },
        { new: true } // Return the updated document
      );
  
      if (!updatedWorkOrder) {
        return res.status(404).json({ message: 'Work Order not found' });
      }
  
      res.status(200).json(updatedWorkOrder);
    } catch (err) {
      res.status(500).json({ message: 'Error updating Work Order', error: err.message });
    }
  });
  

// DELETE - Delete a work order
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await WorkOrder.findByIdAndDelete(id);
        res.status(200).json({ message: 'Work Order Deleted Successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete work order.', error: err.message });
    }
});

module.exports = router;
