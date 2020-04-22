var mongoose = require('mongoose');
//schema to our checkout details
var checkoutSchema = mongoose.Schema({
firstname		:{type:String},
lastname		:{type:String},
email			:{type:String},
notes			:{type:String},
address		    :{type:String},
phonenumber		:{type:Number},

mealsname		:{type:Array},
mealsprice		:{type:Array},
mealsvalue		:{type:Array},
mealstotal		:{type:Array},
total		:{type:String}
});


module.exports = mongoose.model('checkout', checkoutSchema);
