// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        firstname    : String,
        lastname     : String,
        email        : String,
        phonenumber  : String,
        password     : String,
        nic          : String,
        address      : String,

    },

    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});




// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
//schema to our book details
// var bookSchema = mongoose.Schema({
// pickupDate: {type:Date} ,
// pickTime:{type:String},
// pickLocation:{type:String},
// dropDate: {type:Date},
// phoneNumber: {type:Number},
// nicNumber: {type:String},
// driver: {type:String}
// });
//
//
// module.exports = mongoose.model('book', bookSchema);
