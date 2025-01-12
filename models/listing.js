const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const default_image = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fbeautiful-places&psig=AOvVaw3tU1OEQ4yQAy9wMukPJQ1-&ust=1736660635501000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOiQ-pX77IoDFQAAAAAdAAAAABAE';
const listingSchema = new Schema({
    title :{
        type: String,
        require: true,
    },
    description: String,
    image: {
        type: Object,
        default: {
            filename:'default',
            url:default_image,
        },
        set: (v) => v === ""? default_image:v,
    },
    price :Number,
    location : String,
    country : String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
