const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs_mate = require('ejs-mate');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const {validationSchema, reviewSchema} = require('./schema.js');
const Review = require('./models/reviews.js');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/expressErrors');
const reviews = require('./models/reviews.js');




app.set('view engine','ejs');

app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, 'public')));


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

// joi middleware for validation

const joiValidation = (req, res, next)=>{
    let {error} = validationSchema.validate(req.body);

    if(error){
        throw new ExpressError(400, result.error);
    }
    else{
        next();
    }
};

const joiSchemaValidation = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, result.error);
    }
    else{
        next();
    }
}

app.get('/',(req,res)=>{
    res.send('hello this is server');
});

//  index route
app.get('/Listing', wrapAsync(async (req,res)=>{
    const AllListing = await Listing.find({});

    //listings\index.ejs"
    res.render('listings/index.ejs',{AllListing});
}))


// show route

app.get('/Listing/:id',wrapAsync( async (req, res) =>{
   let {id} = req.params;
   const listing = await Listing.findById(id).populate("reviews");

   res.render('listings/show.ejs',{listing})
}));


// new route
app.get('/Listings/newPlace',  (req, res)=>{
        res.render('listings/form.ejs');
});

app.post('/Listing/new',joiValidation,wrapAsync (async (req, res,next) =>{
               
                const newPlaceVal = new Listing(req.body);
                await newPlaceVal.save();
                res.redirect('/Listing');
              
}));

// edit route

app.get('/Listing/:id/edit',wrapAsync(async (req, res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    res.render('listings/edit.ejs',{list});
}));

// update route
app.put('/Listing/:id',joiValidation
    ,
    wrapAsync( async (req, res) =>{
    let {id} = req.params;

    await Listing.findByIdAndUpdate(id,{...req.body});
    res.redirect('/Listing');
}));

// Delete post

app.delete('/listing/:id',wrapAsync( async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/Listing');
}));
//Reviews Post Routes
app.post('/listings/:id/reviews',joiSchemaValidation,wrapAsync( async (req, res)=>{
               let listing = await Listing.findById(req.params.id);
               let newReview = new Review(req.body.review);
               listing.reviews.push(newReview);
                  
              await newReview.save();
              await listing.save();
              console.log('review added');
              res.redirect(`/Listing/${listing._id}`);
              
}));

// delete the review

app.delete(('/listing/:id/review/:rid'), wrapAsync(async(req, res)=>{
    let {id, rid} = req.params;
      
      await Listing.findByIdAndUpdate(id, {$pull:{reviews: rid}
      });
       await Review.findByIdAndDelete(rid);
       res.redirect(`/Listing/${id}`);
}))
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
// for by defualt route for page not found

app.all('*',(req,res,next)=>{
    next(new ExpressError(404, "Page not found!"));
})
// error middleware

app.use((err, req, res,next)=>{
     
     console.log(err);
     
    let {statusCode=500, message='Something went wrong!!'} = err;
    res.status(statusCode).render('Error/error.ejs',{message});
   
})

app.listen(port,()=>{
    console.log('server is runing on port',port);
    
})