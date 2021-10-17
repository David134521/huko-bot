const discord = require('discord.js');
const client = new discord.Client();
const botToken = "ODk4OTQ3NzY0MTQ5NDIwMDUy.YWroWA.zRRmBjVd6e7zF0n3KrOCWZNCs28";
const fs = require("fs")
const prefix = "$";

client.commands = new discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once("ready", () => {
    console.log("All good!");
});

// Censor messages

client.on("message", message => {
    let blacklisted = ['word'];
    let foundInText = false;
    for (var i in blacklisted) {
      if (message.content.toLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true;
    }
    if (foundInText) {
      message.delete();
      console.log("Message deleted: " + message.content);
    }
});

// Member add

client.on("guildMemberAdd", member => {
    const channel = member.guild.channels.find(channel => channel.name === "welcome");
    if(!channel) return;

    console.log("User joined " + member);
    channel.send("Welcome, " + member);
})

// Commands

client.on("message", message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLocaleLowerCase();
    // Verify and others

    if(command === "info") {
        console.log("Getting server info!");
        message.channel.send([
            "Server name: " + message.guild.name,
            "Server members: " + message.guild.memberCount,
            "Server ID: " + message.guild.id
        ]);
    } else if(command === "verify") {
        console.log("Verifying user!");
        let role = message.member.guild.roles.cache.find(role => role.name === "verify");
        if (role) message.guild.members.cache.get(message.author.id).roles.add(role);
        message.delete();

       // Kick, Ban, Mute 
    } else if(command === "kick") {
        client.commands.get("kick").execute(message, args);
    }
});

client.login(botToken);