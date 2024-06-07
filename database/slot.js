const {mongoose,Schema} = require("mongoose")

const slot = new Schema({
    guild: String,
    userid: String,
    time: String,
    channel: String,
    message: String,

})

 module.exports = mongoose.model('slots', slot)