const {
    client,
    EmbedBuilder,
    PermissionsBitField,
    time,
    ApplicationCommandPermissionType
  } = require("discord.js");
  const mongoose = require("mongoose");
  const slot = require("../database/slot");
  const sets = require("../database/setslot");
  const config = require("../other/config");
  const p = require("../database/ping");
  const eb = require('../other/embed')
  
  module.exports = {
    name: "create",
    description: "nothing",
    aliases: ["createslot", "cs"],
    async execute(client, message, args) {
      try {
  
        const ia = new EmbedBuilder()
          .addFields({
            name: `__invalid argument provided__`,
            value: `use correct argument example:\n-create @mafia(user) 1(category) 1d/1m(time day month) mafia slot(slot name)`
          })
          .setThumbnail(`${message.guild.iconURL() || "https://cdn.discordapp.com/avatars/59434350/5713257311f4bcf376aa13ea1cf76c.png?size=4096"}`)
          .setColor(`Red`)
  
  
        if (args.length < 3) {
          return await message.channel.send({
            embeds: [ia]
          });
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
  
          return await message.channel.send("unable to create channel missing permisssion")
        }
  
  

  
        let user = await message.mentions.users.first() || await client.users.fetch(args[0]);
  
        if (!user) {
          return await message.channel.send("user not found");
        }
  
        let member = await message.guild.members.fetch(user.id);
  
        if (!member) {
          return await message.channel.send("member not in guild");
        }
  
        let setslot = await sets.findOne({
          guild: message.guild.id
        });
  
        let cate;
  
   
  
  
  
        switch (args[1]) {
  
          case "1":
            cate = setslot.one;
          
            break;
          case "2":
            cate = setslot.two;
            
            break;
          case "3":
            cate = setslot.three;
          
  
            break;
          default:
            return message.channel.send(`invalid argument provided \nuse correct argument example: -create @mafia(user) 1(category) 1d/1m(time day month) mafia slot(slot name)`);
        }

        if (cate == "None") return await message.channel.send("you need to set category use: -setslot 87287827382(categoryid) 1/2/3(number)")  
  
  
  
        let timeValue = parseInt(args[2]);
        let timeUnit = args[2].replace(timeValue, '');

        let tu = timeUnit.toLowerCase()

        console.log("this",tu)

     
  
        let realt;
        switch (tu) {
          case 's':
            realt = 60 * 1000; 
            break;
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
  
        let expt = timeValue * realt;
        let finalt = new Date(Date.now() + expt);
  
        const username = (user.username).replace("0", "");
  
  
        let categoryChannel = await message.guild.channels.fetch(cate);
        if (!categoryChannel) {
          return await message.channel.send(`category not found id: ${cate}`);
        }
  
        if (categoryChannel.children.cache.size == 50) {
          return await message.channel.send("max slot limit reach try another category")
        }
  
        let role = await message.guild.roles.fetch(roles);
        if (!role) {
          return await message.channel.send(`role not found id: ${roles}`);
        }
  
  
        console.log(categoryChannel.id)
        let newchannel = await message.guild.channels.create({
          name: args.slice(3).join(' ') || username,
          type: 0,
          parent: categoryChannel.id,
          permissionOverwrites: [{
              id: message.guild.id,
              deny: [PermissionsBitField.Flags.SendMessages]
            },
            {
              id: member.id,
              allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
            }
          ],
        });
  
        let date = new Date
  
  
  
        let d = new Date
  
        new p({
          guild: message.guild.id,
          channel: newchannel.id,
          userid: member.id,
          ping: "0",
          time: d.toLocaleString()
        }).save()
  
        await member.roles.add(role).catch(x => message.channel.send("unable to add role missing permission"))
  
        let formattedDate = finalt.toLocaleString('en-US', {
          day: "numeric",
          month: "numeric",
          year: "numeric",
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }).replace(",", "");
  

  
        let msg = await newchannel.send({
          embeds: eb(message,config,member,finalt)
        }).catch(x => message.channel.send("unable to send embed missing permission"))
  
        new slot({
          guild: message.guild.id,
          userid: member.id,
          time: finalt.getTime(),
          channel: newchannel.id,
          message: msg.id,
  
        }).save();
  
      } catch (e) {
        console.log(e)
        
      }
    }
  }
