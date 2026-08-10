const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/notes_app';
  await mongoose.connect(uri);
};

module.exports = connectDB;
