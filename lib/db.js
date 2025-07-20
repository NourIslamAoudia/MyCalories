// controllers/profilController.js
const mongoose = require('mongoose');
require('dotenv').config();

let connection = null;

async function connectDB() {
  if (connection) return connection;

  try {
    connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');
    return connection;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
}

module.exports = connectDB;
