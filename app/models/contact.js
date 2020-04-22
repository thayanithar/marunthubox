var mongoose = require('mongoose');
//schema to our contact details
var contactSchema = mongoose.Schema({
name:{type:String},
email:{type:String},
subject:{type:String},
message:{type:String},
number:{type:Number}

});


module.exports = mongoose.model('contact', contactSchema);
