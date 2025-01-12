const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs_mate = require('ejs-mate');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override')

app.set('view engine','ejs');

app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,"/public")));

app.use(express.urlencoded({extended:true}))  // for parsing
app.use(methodOverride('_method'));
app.engine('ejs', ejs_mate);

const port = 3001;
//  to connect database
const MongoURL = 'mongodb://127.0.0.1:27017/DeltaAirbnb';

async function main() {
    await mongoose.connect(MongoURL);

}

main().then(()=>{
    console.log('connect to Db');
    
}).catch(err =>{
    console.log(err);
    
})



app.get('/',(req,res)=>{
    res.send('hello this is server');
});

//  index route
app.get('/Listing',async (req,res)=>{
    const AllListing = await Listing.find({});

    //listings\index.ejs"
    res.render('listings/index.ejs',{AllListing});
})


// show route


app.get('/Listing/:id', async (req, res) =>{
   let {id} = req.params;
   const listing = await Listing.findById(id);

   res.render('listings/show.ejs',{listing})
})


// new route
app.get('/Listings/newPlace',  (req, res)=>{
        res.render('listings/form.ejs');
});

app.post('/Listing/new', async (req, res) =>{
              
    const newPlaceVal = new Listing(req.body);
    await newPlaceVal.save();
    res.redirect('/Listing');
    
});

// edit route

app.get('/Listing/:id/edit',async (req, res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    res.render('listings/edit.ejs',{list});
});

// update route
app.put('/Listing/:id', async (req, res) =>{
    let {id} = req.params;

    await Listing.findByIdAndUpdate(id,{...req.body});
    res.redirect('/Listing');
});

// Delete post

app.delete('/listing/:id', async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/Listing');
})
// app.get('/testListing',async (req, res)=>{
//     let sampleListing = new Listing({
//         title : 'my new Villa',
//         description: ' this is very beautiful',
//         price: 12000,
//         location: 'Goa',
//         country:'India',

//     });
//     await sampleListing.save();
//     console.log('sample saved');
//     res.send('success')

// })

app.listen(port,()=>{
    console.log('server is runing on port',port);
    
})