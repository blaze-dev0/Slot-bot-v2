const {mongoose, Schema} = require("mongoose")


const expire = new Schema({
    guild: String,
    channel: String,
    expire: String,
    userid: String,
})

module.exports = mongoose.model("expire",expire)