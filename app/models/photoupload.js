var mongoose = require('mongoose');
//schema to our host details
var photouploadSchema = mongoose.Schema({
photos:{type:String},
pnames:{type:String},
prices:{type:Number}

});


module.exports = mongoose.model('photoupload', photouploadSchema);
