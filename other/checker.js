const slot = require("../database/slot")
const p = require("../database/ping")
const cf = require('./config')

const { PermissionsBitField } = require("discord.js")


const ping = async (message) => {

  let d = new Date

  const sl = await slot.findOne({ channel: message.channel.id })

  if (!sl) {
    return
  }



  let channel = message.channel

  if (!channel.id == sl.channel) {
    return
  }

  if (message.content == "@everyone") {
    if (sl.userid == message.member.id) {
      channel.permissionOverwrites.set([
        {
          id: message.guild.id,
          deny: [PermissionsBitField.Flags.SendMessages]
        },
        {
          id: message.member.id,
          deny: [PermissionsBitField.Flags.SendMessages]
        }
      ])
      await message.channel.send("everyone ping detected slot revoked")


    }

    let logchannel = await message.guild.channels.fetch(cf.config.logchannel)
    let staff = await message.guild.roles.fetch(cf.config.staff_x)
    if (!staff) {
      staff = undefined
    }
    if (logchannel) {

      await logchannel.send(`Channel id: ${message.channel.id}\nChannel Name: ${message.channel.name}\nUser id: ${message.member.id}\nUser Name: ${message.member.user.username}\n\nSlot Has been Revoked Due To Everyone Ping\n${staff}`)

    }

  } else if (message.content == "@here") {
    if (sl.userid == message.member.id) {


      const st = await p.findOne({ channel: message.channel.id })

      if (!st) {
        new p({
          guild: message.guild.id,
          channel: channel.id,
          userid: sl.userid,
          ping: 1,
          time: d.toLocaleString()
        }).save()

        message.channel.send("1/3")
      } else {




        console.log(st.time.slice(0, 9), d.toLocaleString().slice(0, 9))
        console.log(st.time.slice(0, 9) < d.toLocaleString().slice(0, 9))

        if (st.time.slice(0, 9) < d.toLocaleString().slice(0, 9)) {



          await p.findOneAndUpdate({ channel: channel.id }, { ping: "1" })
          await p.findOneAndUpdate({ channel: channel.id }, { time: d.toLocaleString() })

          await message.channel.send("1/3")
          return
        }
        await p.findOneAndUpdate({ channel: channel.id }, { ping: parseInt(st.ping) + 1 })


        if (st.ping < st.maxping) {
          message.channel.send(`${st.ping + 1} / ${st.maxping}`)
        } else {

          message.channel.send(`${st.ping + 1} / ${st.maxping}`)
          message.channel.send("slot has been revoked")
          let logchannel = await message.guild.channels.fetch(cf.config.logchannel)
          let staff = await message.guild.roles.fetch(cf.config.staff_x)
          if (!staff) {
            staff = undefined
          }
          if (logchannel) {



            await logchannel.send(`Channel id: ${message.channel.id}\nChannel Name: ${message.channel.name}\nUser id: ${message.member.id}\nUser Name: ${message.member.user.username}\n\nSlot Has been Revoked Due To Everyone Ping\n${staff}`)

          }





          channel.permissionOverwrites.set([
            {
              id: message.guild.id,
              deny: [PermissionsBitField.Flags.SendMessages]
            },
            {
              id: message.member.id,
              deny: [PermissionsBitField.Flags.SendMessages]
            }
          ])

        }

      


      }
    }

  }
}

module.exports = ping;
