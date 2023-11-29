const mongoose = require('mongoose');

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.DATABASE_URI,{
            dbName:'vo_backend'
        });
        console.log('MongoDB connected successfully');
        
    }catch (err) {
        console.error('MongoDB connection failed:',err.message);
        process.exit(1);
    }
}

module.exports = connectDB;