const express = require('express');
const router = express.Router();
const Item = require('../models/item')
// Import any necessary models and middleware

router.post('/add', async (req, res) => {
    // console.log(req.body.item);
    try{
        const newItem = new Item(req.body.item);
        console.log(req.body.item);
        await newItem.save();
        res.status(201).json(newItem);
    }catch (error){
        res.status(400).json({message:error.message});
    }
});

module.exports = router;
