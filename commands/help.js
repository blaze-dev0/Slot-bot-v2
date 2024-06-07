const {Client,EmbedBuilder} = require("discord.js");
const config = require("../other/config");
module.exports = {
    name: 'help',
    description: "help command",
    aliases: ["h"],
    async execute(client,message,args) {
       

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
        
        return 
    } 

       

       
        const hp = new EmbedBuilder()
        .setAuthor({name: `${message.guild.name}`})
        .setFields({name:"__Help Panel__" ,value: `**help** - Show This Embed\n**Create** - Create Slot\n**Renew** - extend slot and Renew  Slot when expire\n**Revoke** - Revoke Slot\n**continue** - Continue Slot\n**setslot** - Set Slot Category`})
        .setFooter({text: `Requested By ${message.author.username}`})
        .setThumbnail(`${message.guild.iconURL() || "https://cdn.discordapp.com/avatars/59434350/5713257311f4bcf376aa13ea1cf76c.png?size=4096"}`)
        .setColor(`#0000FF`)
        await message.channel.send({ embeds: [hp]})
    }
}