const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    googleId: {
        type: String,
        unique: true
    },
    cart: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantity: Number,
    }],
    isAdmin: {
        type: Boolean,
        default: false,
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
