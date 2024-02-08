const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser =  require('cookie-parser');


// Initialising the Express App
const app = express();

const PORT = process.env.PORT || 3000;

// For accessing json requests sent
app.use(express.json());

//Middleware to use cookies
app.use(cookieParser());


// Connecting to the MongoDB and starting the server
const dbURI = "mongodb+srv://sabari:sabari123@sbceauth.rzxq9kn.mongodb.net/sbceusersdb?retryWrites=true&w=majority";
mongoose.connect(dbURI)
.then((result) => app.listen(PORT, () => console.log("Server connected at PORT:", PORT)))
.catch((err) => console.log(`Mongoose connect error: ${err}`));

// Middleware to use auth routes
app.use(authRoutes);

