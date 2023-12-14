const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authenticateMiddleware');
const axios = require('axios');
const OpenAI = require("openai");
const mobilnet  = require('@tensorflow-models/mobilenet');

// Create a new instance of the openai client with our API key
const openai = new OpenAI({ 
    apiKey: "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",
 });

const threadByUser = {}; // Store thread IDs by user

router.get('/image',requireAuth,async(req,res)=>{

});

router.get('/event', requireAuth, async (req, res) => {

    const assistantIdToUse = "asst_R0uzyWWScVYUR9lMFpNsfR1s"; // Replace with your assistant ID
    const userMessage = req.body.message;

    const userId = req.user._id;
    // const {item_name, location} = req.body;
    // const content = JSON.stringify({item_name,location});
    console.log(`${userId} trying to ask ${userMessage}`);


      // Create a new thread if it's the user's first message
    if (!threadByUser[userId]) {
        try {
            const myThread = await openai.beta.threads.create();
            console.log("New thread created with ID: ", myThread.id, "\n");
            threadByUser[userId] = myThread.id; // Store the thread ID for this user
        } catch (error) {
            console.error("Error creating thread:", error);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
    }
    
    // Add a Message to the Thread
    try{
        const myThreadMessage = await openai.beta.threads.messages.create(
          threadByUser[userId], // Use the stored thread ID for this user
          {
            role: "user",
            content: userMessage,
          }
        );
        console.log("This is the message object: ", myThreadMessage, "\n");
        
        // Run the Assistant
        const myRun = await openai.beta.threads.runs.create(
          threadByUser[userId], // Use the stored thread ID for this user
          {
            assistant_id: assistantIdToUse,
          }
        );
        console.log("This is the run object: ", myRun, "\n");

        // Periodically retrieve the Run to check on its status
        const retrieveRun = async () => {
          let keepRetrievingRun;
        
          while (myRun.status !== "completed") {
            keepRetrievingRun = await openai.beta.threads.runs.retrieve(
              threadByUser[userId], // Use the stored thread ID for this user
              myRun.id
            );
        
            console.log(`Run status: ${keepRetrievingRun.status}`);
        
            if (keepRetrievingRun.status === "completed") {
              console.log("\n");
              break;
            }
          }
        };
        retrieveRun();
        // Retrieve the Messages added by the Assistant to the Thread
        const waitForAssistantMessage = async () => {
          await retrieveRun();
        
          const allMessages = await openai.beta.threads.messages.list(
            threadByUser[userId] // Use the stored thread ID for this user
          );
        
          // Send the response back to the front end
          res.status(200).json({
            response: allMessages.data[0].content[0].text.value,
          });
          console.log(
            "------------------------------------------------------------ \n"
          );
        
          console.log("User: ", myThreadMessage.content[0].text.value);
          console.log("Assistant: ", allMessages.data[0].content[0].text.value);
        };
        waitForAssistantMessage();
    }catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    
});


module.exports = router;