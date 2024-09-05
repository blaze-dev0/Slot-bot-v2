

const {mongoose,Schema} = require("mongoose")

const ping= new Schema({
    guild: String,
    channel: String,
    userid: String,
    ping: Number,
    maxping: Number,
    time: String,

})

 module.exports = mongoose.model('pings', ping)
