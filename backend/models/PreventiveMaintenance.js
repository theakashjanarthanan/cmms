// backend\models\PreventiveMaintenance.js

const mongoose = require('mongoose');

const preventiveMaintenanceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low',
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending',
    },
    frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly'],
        default: 'Monthly',
    }
}, { timestamps: true });

module.exports = mongoose.model('PreventiveMaintenance', preventiveMaintenanceSchema);
