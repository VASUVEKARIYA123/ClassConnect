const mongoose = require('mongoose');

// const url = "mongodb+srv://22ceuos020:Akfmongo25@cluster0.lrpvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// for localhost : 
// const url = "mongodb://localhost:27017/Class";
// const url = 'mongodb://localhost:27017/google'
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database Connection Successful");
  })
  .catch(() => {
    console.log("Database Connection Failed");
  });

  
