const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    price: Number,
    quantity: {
        type: Number,
        required: false,
        min: 0
    },
    category: String,
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    lastModified: Date
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
