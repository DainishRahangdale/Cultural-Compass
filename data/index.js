const mongoose = require('mongoose');

const data = require('./sample');

const Listing = require('../models/listing.js');



const MongoURL = 'mongodb://127.0.0.1:27017/DeltaAirbnb';

async function main() {
    await mongoose.connect(MongoURL);

}

main().then(()=>{
    console.log('connect to Db');
    
}).catch(err =>{
    console.log(err);
    
});


const initDB = async () =>{
    await Listing.deleteMany();

    await Listing.insertMany(data.data);
    console.log('db initialized');
    
}

initDB();

