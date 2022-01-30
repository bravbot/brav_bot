require("dotenv").config()
const Discord = require("discord.js");
const Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MEMBERS
    ]
});

const Canvas = require("canvas");

Client.on("ready", () => {
    console.log("bot opérationnel");
}),

Client.on("guildMemberAdd", async member => {
    console.log("Un membre est arrivé.");  
    Client.channels.cache.get("937381312636014623").send("<@" + member.id + "> est arrivé.");  // id du salon ou on veut le message
    member.roles.add("746829955257597962");       // id rôle qu'on veut add à l'arrivé

    var canvas = Canvas.createCanvas(1024, 500);

    ctx = canvas.getContext("2d")

    var background = await Canvas.loadImage("./Background.png");     //nom de l'image dans le dossier
    ctx.drawImage(background, 0, 0, 1024, 500);

    ctx.font = "43px Arial";
    ctx.fillStyle = "#FFFAFA";
    ctx.textAlign = "center";
    ctx.fillText(member.user.tag.toUpperCase(), 540, 410);

    ctx.beginPath();
    ctx.arc(512, 166, 119, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    var avatar = await Canvas.loadImage(member.user.displayAvatarURL({
        format: "png",
        size: 1024
    }));

    ctx.drawImage(avatar, 393, 47, 238, 238);

    var attachment = new Discord.MessageAttachment(canvas.toBuffer(), "welcome.png");

    Client.channels.cache.get("937381312636014623").send({files: [attachment]});     // id du salon ou on veut le message
});

Client.on("guildMemberRemove", member => {
    console.log("Un membre à quitté le serveur.");
    Client.channels.cache.get("937381312636014623").send("<@" + member.id + "> à quitté.");    // id du salon ou on veut le message
});


const prefix = "<";

Client.on("messageCreate", message => {
    if (message.author.bot) return;
    
    if(message.member.permissions.has("ADMINISTRATOR")){
        // <ban
        if(message.content.startsWith(prefix + "ban")){
            let mention = message.mentions.members.first();
            const embed = new Discord.MessageEmbed()
                .setColor("#FF0000")
                .setDescription("Commande invalide, essaie de l'utiliser comme ça : \n ``<ban @mention``")
                .setTimestamp()
                .setFooter("Brav-BOT");

            if(mention == undefined){
                message.channel.send({ embeds: [embed]});
            }
            else {
                if(mention.bannable){
                    mention.ban();
            const embed = new Discord.MessageEmbed()
                .setColor("#0029F6")
                .setDescription(mention.displayName + " à bien été banni du serveur.")
                .setTimestamp()
                .setFooter("Brav-BOT");
                     message.channel.send({ embeds: [embed]});
                }
                else{
                    message.reply("Impossible de bannir ce membre.");
                }
            }
        }

        // <kick
        else if(message.content.startsWith(prefix + "kick")){
            let mention = message.mentions.members.first();
            const embed = new Discord.MessageEmbed()
                .setColor("#FF0000")
                .setDescription("Commande invalide, essaie de l'utiliser comme ça : \n ``<kick @mention``")
                .setTimestamp()
                .setFooter("Brav-BOT");

            if(mention == undefined){
                message.channel.send({ embeds: [embed]});
            }
            else {
                if(mention.kickable){                                                       //#0029F6 bleu
                    mention.kick();
            const embed = new Discord.MessageEmbed()
                .setColor("#0029F6")
                .setDescription(mention.displayName + " à été exclu du serveur.")
                .setTimestamp()
                .setFooter("Brav-BOT");
                    message.channel.send({ embeds: [embed]}) 
                }
                else{
                    message.reply("Impossible d'excluse se membre.");
                }
            }
        }

        // <mute
        else if(message.content.startsWith(prefix + "mute")){
            let mention = message.mentions.members.first();
            const embed = new Discord.MessageEmbed()
                .setColor("#FF0000")
                .setDescription("Commande invalide, essaie de l'utiliser comme ça : \n ``<mute @mention``")
                .setTimestamp()
                .setFooter("Brav-BOT");

            if(mention == undefined){
                message.channel.send({ embeds: [embed]});
            }
            else {
                mention.roles.add("937431094100373555");   // role mute id
            const embed = new Discord.MessageEmbed()
                .setColor("#FF8F00")
                .setDescription(mention.displayName + " à été mute")
                .setTimestamp()
                .setFooter("Brav-BOT");
                message.channel.send({ embeds: [embed]})                                                                   
            }                     
        } 

        // <unmute
        else if(message.content.startsWith(prefix + "unmute")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Membre non ou mal mentionné.");
            }
            else {
                mention.roles.remove("937431094100373555");   //role mute id
                message.channel.send(mention.displayName + " à été unmute. **C'est bon on t'entends !**");
            }
        }

        //<tempmute
        else if(message.content.startsWith(prefix + "tempmute")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Membre non ou mal sanctionné.");
            }
            else {
                let args = message.content.split(" ");

                mention.roles.add("937431094100373555");        //role mute id
                message.channel.send(mention.displayName + "à été muté temporairement. Tu pourras bientôt parler");
                setTimeout(function() {
                    mention.roles.remove("937431094100373555");    //rôle mute id
                    message.channel.send(mention.displayName + " tu peux désormais parler.");
                }, args[2] * 1000);
            }
        }
    }
    //<help
    if(message.content === prefix + "help"){
        const embed = new Discord.MessageEmbed()
            .setColor("#990000")
            .setAuthor("Brav-BOT")
            .setDescription("Ceci est une liste de commandes que vous pouvez utiliser. Utiliser ces commandes avec le préfix ``<``.")
            .addField("Aide","``help``: affiche la liste des commandes")
            .addField("Modération","**-**``kick @mention``: exclu un membre du serveur \n **-**``ban @mention``: ban un membre du serveur")
            .addField("Mute","**-**``mute @mention``: mute un membre du serveur \n **-**``unmute @mention``: unmute un membre du serveur \n **-**``tempmute @mention temps sec``: mute temporairement un membre du serveur ")
            .setTimestamp()
            .setFooter("Brav-BOT appartient à @Benjy#7209");

        message.channel.send({ embeds: [embed]})
    }    
});

console.log(process.env.TOKEN);
Client.login(process.env.TOKEN);