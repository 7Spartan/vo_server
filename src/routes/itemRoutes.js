const express = require('express');
const router = express.Router();
const Item = require('../models/item')
const requireAuth = require('../middleware/authenticateMiddleware');
// Import any necessary models and middleware

router.post('/add', async (req, res) => {
    // console.log(req.body.item);
    try{
        const userId = req.user._id;
        const newItemData = {...req.body.item,addedBy: userId};
        const newItem = new Item(newItemData);
        await newItem.save();
        console.log(newItem);
        res.status(201).json(newItem);
    }catch (error){
        console.log(error.message);
        res.status(400).json({message:error.message});
    }
});

router.get('/list', requireAuth, async (req, res) => {
    const userId = req.user._id;
    console.log(`${userId} trying to get items`);
    try{
        const items = await Item.find({ addedBy: userId });
        res.status(200).json(items);
    }catch (error){
        console.error('Failed to get items:', error);
        res.status(400).json({message:error.message});
    }
});

router.delete('/list', requireAuth, async(req,res) => {
    const userId = req.user._id;
    console.log(`${userId} trying to delete an item ${req.body.item._id}`);
    try{
        await Item.deleteOne({_id: req.body.item._id});
        res.status(200).json({"message":"Deleted"});
    }  catch(error){
        console.log(error);
        res.status(400);
    }
});
module.exports = router;
