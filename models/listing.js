const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const default_image = 'https://photos.onedrive.com/share/E6B7E22EBE93C63E!s6d709e0ac5a4470aa4d730a0ca384f08?cid=E6B7E22EBE93C63E&resId=E6B7E22EBE93C63E!s6d709e0ac5a4470aa4d730a0ca384f08&ithint=photo&e=comq0q&migratedtospo=true&redeem=aHR0cHM6Ly8xZHJ2Lm1zL2kvYy9lNmI3ZTIyZWJlOTNjNjNlL0VRcWVjRzJreFFwSHBOY3dvTW80VHdnQjZndDVkN2NtQ3VxX2J5WVZPQzhTaHc_ZT1jb21xMHE';

const ImageSchema = new mongoose.Schema({
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
        type: ImageSchema,
        default: () => ({ filename: 'default', url: default_image }),
        set: (v) => {
            if (v === "") {
                return { filename: 'default', url: default_image };
            }
            return { filename: 'fileNew', url: v };
        },
    }
    ,
    price :Number,
    location : String,
    country : String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
