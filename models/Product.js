const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    image: {
        type: String,
        default: "https://img.drz.lazcdn.com/static/bd/p/bf0db57d4e8c93ac9fc2d841b57b22b5.jpg_720x720q80.jpg",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("Product", productSchema);