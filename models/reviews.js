const mongoose = require('mongoose');
const { Schema } = mongoose;


const reviewSchema = new Schema({
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})

module.exports = mongoose.model('Review', reviewSchema);
