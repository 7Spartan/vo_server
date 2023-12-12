const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authenticateMiddleware');
const axios = require('axios');

// Create a new instance of the openai client with our API key
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/event', requireAuth, async (req, res) => {
    const userId = req.user._id;
    const {item_name, location} = req.body;
    const content = JSON.stringify({item_name,location});
    console.log(`${userId} trying to get ${content}`);
    try{
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'user',
                    content: content,
                },],},
            {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            }
        );
        console.log(response);
     return response?.data?.choices?.[0]?.message?.content;
    }catch (error){
        console.error('Failed to get items:', error);
        res.status(400).json({message:error.message});
    }
});

module.exports = router;