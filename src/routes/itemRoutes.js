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

router.post('/delete', requireAuth, async(req,res) => {
    const userId = req.user._id;
    const {itemIds} = req.body;
    console.log(`${userId} trying to delete an item ${itemIds}`);
    try{
        const result = await Item.deleteMany({'_id':{$in:itemIds}})
        if (result.deletedCount>0){
            res.status(200).json({"message":"Deleted"});
        }else{
            res.status(404).json({"message":"no items to delete"});
        }
    }  catch(error){
        console.log(error);
        res.status(500).json({message:"Error deleting items"});
    }
});
module.exports = router;
