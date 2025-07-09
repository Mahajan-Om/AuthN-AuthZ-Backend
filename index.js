const express = require('express');
const app = express();

require('dotenv').config(); 

const PORT = process.env.PORT || 4000

// what is cookie-parser what is the need of it 
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());


const dbconnect = require('./config/database');
dbconnect();

const user = require('./routes/user')
app.use('/api/v1',user);

app.listen(PORT , ()=>{
    console.log(`App is listening at ${PORT}`);
})



