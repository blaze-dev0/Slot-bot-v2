const slot = require("../database/slot");
const expire = require("../database/expire")
const p = require("../database/ping");
const {
  client,
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");


const end = (client, cf) => {


  setInterval(async () => {

    try {


      let data = await slot.find({})
      if (!data) {
        return console.log("no data found")
      }

      let date = new Date

      for (const a of data) {


        if (a.time <= date.getTime()) {
          console.log("yes")
          new expire({
            guild: a.guild,
            channel: a.channel,
            userid: a.userid,
            expire: "true",
          }).save()


          let ping = await p.findOne({
            channel: a.channel
          })
          if (ping) {

            await p.findOneAndDelete({
              channel: a.channel
            })

          }

          await slot.findOneAndDelete({
            time: a.time
          })
          const guild = await client.guilds.fetch(a.guild)
          if (!guild) return console.log("guild not found")

          let channel = await guild.channels.fetch(a.channel)
          if (!channel) return console.log("channel not found")
          await channel.send("Slot End")

          let member = await guild.members.fetch(a.userid)

          if (!member) {
            return console.log("memeber not found")
          }


          channel.permissionOverwrites.set([{
            id: member.id,
            deny: [PermissionsBitField.Flags.SendMessages]
          }])







          let role = await guild.roles.fetch(cf.config.role_x)
          if (!role) {
            return console.log("role not found")
          }

          await member.roles.remove(role)




        }
      }



    } catch (e) {
      console.log(e)
    }

  }, 50000)

}

module.exports = end