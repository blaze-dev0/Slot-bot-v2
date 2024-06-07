const {mongoose,Schema} = require("mongoose")

const slot = new Schema({
    guild: String,
    one: String,
    two: String,
    three: String,

})

 module.exports = mongoose.model('setslot', slot)