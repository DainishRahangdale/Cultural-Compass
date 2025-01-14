const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const default_image = "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60";

const ImageSchema = new Schema({
    filename: { type: String, default: 'default' },
    url: { type: String, default: default_image },
});


const listingSchema = new Schema({
    title :{
        type: String,
        require: true,
    },
    description: String,
    image: {
        type: String,
        default: () => ( default_image),
        set: (v) => {
            if (v === "") {
                return default_image ;
            }
            return  v;
        },
    }
    ,
    price :Number,
    location : String,
    country : String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
