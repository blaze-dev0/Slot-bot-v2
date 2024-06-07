

const {mongoose,Schema} = require("mongoose")

const ping= new Schema({
    guild: String,
    channel: String,
    userid: String,
    ping: String,
    time: String,

})

 module.exports = mongoose.model('pings', ping)