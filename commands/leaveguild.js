// Description: Lists all guilds the bot is in.
const { CommandType } = require("wokcommands");

module.exports = {
  category: "Owner",
  aliases: ["leaveguild"],
  description: 'Leave Specific Guild',
  type: CommandType.SLASH,
  guildOnly: true,
  ownerOnly: true,
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: "<guild>",

  callback: ({ client, guild, interaction, args }) => {
   	const guildArg = client.guilds.cache.get(args[0]);
    
    if(guildArg) {
    	guildArg.leave();
         return { embeds: [{ description: `Left Guild `}] };
	} else {
         return { embeds: [{ description: `Guild not found `}] };
    }
  },
}