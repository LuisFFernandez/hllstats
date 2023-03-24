const { SlashCommandBuilder
    , Client
    , GatewayIntentBits
    , ActionRowBuilder
    , ButtonBuilder
    , ButtonStyle
    , EmbedBuilder
    , InteractionResponse } = require('discord.js');
var mysql = require("mysql");
const https = require('https');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('agregar-seguimiento-jugador')
        .setDescription('Agrega una steamId para que el sistema actualice su estado en el Servidor HLL Hispanoamerica')
        .addStringOption(option => option.setName('input').setDescription('SteamId del jugador')),
    async execute(interaction) {

        try {

            var conexion = mysql.createConnection({
                host: 'localhost',
                database: 'hll_discord_bot',
                user: 'root',
                password: '',
                multipleStatements: true
            });

            conexion.connect(function (error) {
                if (error) {
                    throw error;
                }
            });

            // console.log(interaction);
            const steam_id = interaction.options.getString('input');
            conexion.query("SELECT * FROM `seguimiento_jugador` ", function (error, results, fields) {
                if (error) throw error;
                var is_connected = false;

                results.forEach(result => {
                    if (steam_id == result.steam_id)
                        is_connected = true;
                });

                if (is_connected) {
                    interaction.reply({ content: `Usuario con la steamID: ${steam_id} ya esta agregado al sistema.`, ephemeral: true });
                    conexion.end();
                } else {
                    var url_steam_api = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=47EF077B0B5795736F0AB9A0AA1071DE&steamids=${steam_id}`;
                    https.get(url_steam_api, (res) => {
                        let body = "";
                        res.on("data", (chunk) => {
                            body += chunk;
                        });
                        res.on("end", () => {
                            try {
                                let json = JSON.parse(body);
                                var steamData = json.response.players[0];
                                conexion.query(" INSERT INTO `seguimiento_jugador` (`steam_id`, `steam_username`, `guild_id`, `params`) VALUES ('" + steam_id + "', '" + steamData.personaname + "' ,'" + interaction.guildId + "', '') ", function (error, results, fields) {
                                    if (error) throw error;
                                    // conexion.end();

                                    interaction.reply({ content: `Agregaste a ${steamData.personaname} con la steamID: ${steam_id} al sistema.`, ephemeral: true });
                                    conexion.end();
                                });
                            } catch (error) {
                                console.log(error);
                            }
                        });
                    });
                }
            });

        } catch (error) {
            console.log(error);
        }
    }
};
