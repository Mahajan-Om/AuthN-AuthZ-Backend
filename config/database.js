
const mongoose = require('mongoose');

const dbconnect = ()=>{

    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log('DB is connected successfully.')
    })
    .catch((error)=>{
        console.log("DB connection Issues.");
        console.error(error);
        process.exit(1);
    })
}

module.exports = dbconnect;

