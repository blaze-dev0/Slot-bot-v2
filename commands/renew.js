const {
    client,
    EmbedBuilder,
    PermissionsBitField
  } = require("discord.js");
  const mongoose = require("mongoose");
  const slot = require("../database/slot");
  const sets = require("../database/setslot");
  const config = require("../other/config");
  const ping = require("../database/ping");
  const expire = require('../database/expire');
  const eb = require('../other/embed')
  
  module.exports = {
    name: "renew",
    description: "nothing",
    aliases: ["extend"],
    async execute(client, message, args) {
      try {

        const ia = new EmbedBuilder()
        .addFields({name: `__invalid argument provided__`,value: `use correct argument example:\nuse correct argument example: -renew 21381938929(channelid) 1d/1m(time)`})
        .setThumbnail(`${message.guild.iconURL() || "https://cdn.discordapp.com/avatars/59434350/5713257311f4bcf376aa13ea1cf76c.png?size=4096"}`)
        .setColor(`Red`)
  
  
        if (args.length < 2) {
           return await message.channel.send({embeds: ia})
        }
  
  
        let roles = config.config.role_x;
  
   
  
  
  
        let gg = await client.guilds.fetch(config.config.guild_x)
  
        if (!gg) {
          return await message.channel.send("guild not found")
        }
        let staff = await gg.roles.fetch(config.config.staff_x)
  
        if (!staff) {
  
          return await message.channel.send("staff role not found")
        }
  
  
  
        if (!message.member.roles.cache.has(staff.id)) {
          const perm = new EmbedBuilder()
          .addFields({name:"__Missing Permission__",value: "You need staff role to use this"})
          .setThumbnail(`${message.guild.iconURL() || "https://cdn.discordapp.com/avatars/59434350/5713257311f4bcf376aa13ea1cf76c.png?size=4096"}`)
          .setColor(`Red`)

          await message.channel.send({embeds: [perm]})
  
          return
        }
  
     
  
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
  
          return await message.channel.send("unable to renew slot  missing permisssion")
        }
  
  
 
  
  
        let channel = await message.mentions.channels.first() || await message.guild.channels.fetch(args[0])
  
  
  
  
        if (!channel) return await message.channel.send("channel not found")
  
  
  
  
  
  
        let timevalue = parseInt(args[1])
        let timeunit = args[1].replace(timevalue, '');

        let tu = timeunit.toLowerCase()

      

        
  
        let realt;
        switch (tu) {
          case 'day': case'd':
            realt = 24 * 60 * 60 * 1000;
            break;
          case 'month': case'm':
            realt = 30.44 * 24 * 60 * 60 * 1000;
            break;
          default:
            return await message.channel.send({
              embeds: [ia]
            });
        }
  
        let expt = timevalue * realt;
        let finalt = new Date(Date.now() + expt);
  
        let role = await message.guild.roles.fetch(roles);
        if (!role) {
          return await message.channel.send(`role not found id: ${roles}`);
        }


  
  
  
  
  
  
  
        let data = await slot.findOne({
          channel: channel.id
        })
  
  
  
  
        let member;
  
        if (data) {
          member = await message.guild.members.fetch(data.userid);
  
          if (!member) {
            return await message.channel.send("member not in guild");
          }
  
  
    
  
          await slot.findOneAndUpdate({
            channel: channel.id
          }, {
            time: finalt.getTime()
          })
       
  
          let msg = await channel.messages.fetch(data.message)
  
          console.log(msg)
  


  
  
  
  
          let o = await msg.edit({
            embeds: eb(message,config,member,finalt)
          })

          await message.channel.send("slot has been extended")
  
  
  
          return
  
  
  
        } else {
  
          let ep = await expire.findOne({
            channel: channel.id
          })
  
          if (ep) {
  
            if (ep.expire) {
  
              const newchannel = await channel.clone()
  
              await channel.delete()
  
              member = await message.guild.members.fetch(ep.userid);
  
              if (!member) {
                return await message.channel.send("member not in guild");
              }

              await expire.findOneAndDelete({channel: channel.id})
  
  
  
  
  
              new slot({
                guild: message.guild.id,
                userid: member.id,
                time: finalt.getTime(),
                channel: newchannel.id,
              }).save()
  
  
  

              let d = new Date
              new ping({
                guild: message.guild.id,
                channel: newchannel.id,
                userid: member.id,
                ping: "0",
                time: d.toLocaleString()
              }).save()
  
  
  
  
              await member.roles.add(role).catch(x => message.channel.send("unable to add role missing permision"));
  


  
              await newchannel.send({
                embeds: eb(message,config,member,finalt)
              }).catch(x => message.channel.send("unable to send embed missing permision"));
              await message.channel.send("slot has been renew")
            }
          } else {
            await message.channel.send("no data found")
  
            return
          }
  
  
  
        }
  
  
      } catch (e) {
        console.log(e)
      }
    }
  }
