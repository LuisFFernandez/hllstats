const { ActivityType, Client, Collection, Events, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const https = require('https');
var mysql = require("mysql");

const maps = [
    {
        "carentan": "https://static.wikia.nocookie.net/hellletloose/images/a/aa/Carentan.jpg",
        "foy": "https://static.wikia.nocookie.net/hellletloose/images/3/3b/Hll_Map_Foy_StrongPoints.png",
        "hill400": "https://static.wikia.nocookie.net/hellletloose/images/d/d2/Hill400.png",
        "hurtgenforest": "https://static.wikia.nocookie.net/hellletloose/images/3/31/HurtgenV2_7_26_21.png",
        "kharkov": "https://pbs.twimg.com/media/EpiSkSqXcAAMHzW.jpg",
        "kursk": "https://static.wikia.nocookie.net/hellletloose/images/9/98/Kursk-tactical-map.png",
        "omahabeach": "https://static.wikia.nocookie.net/hellletloose/images/8/8f/Omaha.jpg",
        "purpleheartlane": "https://static.wikia.nocookie.net/hellletloose/images/3/31/Purple.png",
        "remagen": "https://thegapodcast.com/wp-content/uploads/2022/07/remagen-map.jpg",
        "stmariedumont": "https://static.wikia.nocookie.net/hellletloose/images/6/6c/SMDMV2_TacMap01_SP.png",
        "stmereeglise": "https://static.wikia.nocookie.net/hellletloose/images/9/94/Eglise.jpg",
        "stalingrad": "https://static.wikia.nocookie.net/hellletloose/images/7/76/Stalingrad_TacMap03.png",
        "utahbeach": "https://static.wikia.nocookie.net/hellletloose/images/f/f9/Utah.jpg"
    },
];

module.exports = {

    server_status: function (channel_param, message_param, client_param) {
        setInterval(() => {
            try {

                let url = "https://stats.hll.la/api/public_info";
                let live_data = "https://stats.hll.la/api/get_live_game_stats";

                https.get(url, (res) => {
                    let body = "";
                    res.on("data", (chunk) => {
                        body += chunk;
                    });
                    res.on("end", () => {
                        try {

                            let json = JSON.parse(body);
                            var server = json.result;

                            const channel = channel_param;
                            var team1, team2;
                            switch (Object.keys(server.players)[0]) {
                                case "allied":
                                    team1 = "<:usa:1084873719178076180>";
                                    break;
                                case "axis":
                                    team1 = "<:ger:1084872536057204766>";
                                    break;
                            }
                            switch (Object.keys(server.players)[1]) {
                                case "allied":
                                    team2 = "<:usa:1084873719178076180>";
                                    break;
                                case "axis":
                                    team2 = "<:ger:1084872536057204766>";
                                    break;
                            }

                            var tiempo_partida = server.raw_time_remaining.split(':');

                            const exampleEmbed = {
                                color: 0x0099ff,
                                title: server.name,
                                fields: [
                                    {
                                        name: `__Jugadores__`,
                                        value: '```' + `${server.player_count} / ${server.max_player_count}` + '```',
                                        inline: true,
                                    },
                                    {
                                        name: `__Tiempo Restante de Partida__`,
                                        value: '```' + tiempo_partida[0] + " hora" + ((tiempo_partida[0] == 0) ? "s " : " ") + parseInt(tiempo_partida[1]) + ' minuto' + ((parseInt(tiempo_partida[1]) == 1) ? "" : "s") + '```',
                                        inline: true,
                                    },
                                    {
                                        name: `__Mapa Actual__`,
                                        value: '```' + server.current_map.human_name + '```' + '\n' + `Comenzo: <t:${server.current_map.start}> - (<t:${server.current_map.start}:R>)`,
                                        inline: false,
                                    },
                                    {
                                        name: Object.keys(server.players)[0].toUpperCase() + " - " + team1,
                                        value: `<:soldier:1084884216103317545> Jugadores: ${server.players[Object.keys(server.players)[0]]}
                                    <:flag:1084885127907254272> Puntos: ${server.score[Object.keys(server.players)[0]]}`,
                                        inline: true,
                                    },
                                    {
                                        name: 'vs',
                                        value: `--
                                    --`,
                                        inline: true,
                                    },
                                    {
                                        name: Object.keys(server.players)[1].toUpperCase() + " - " + team2,
                                        value: `<:soldier:1084884216103317545> Jugadores: ${server.players[Object.keys(server.players)[1]]}
                                    <:flag:1084885127907254272> Puntos: ${server.score[Object.keys(server.players)[1]]}`,
                                        inline: true,
                                    },
                                    {
                                        name: '᲼',
                                        value: '᲼',
                                        inline: false,
                                    },
                                    {
                                        name: `Siguiente Mapa`,
                                        value: '```' + server.next_map.human_name + '```',
                                        inline: false,
                                    }
                                ],
                                image: {
                                    url: maps[0][server.current_map.just_name],
                                }
                            };

                            // LIVE PLAYERS
                            https.get(live_data, (res) => {
                                let body_players = "";
                                res.on("data", (chunk) => {
                                    body_players += chunk;
                                });
                                res.on("end", () => {
                                    try {
                                        let json_players = JSON.parse(body_players);
                                        var players = json_players.result;
                                        console.log(players);

                                        // var player_row_1 = "";
                                        // var player_row_2 = "";
                                        // var player_row_3 = "";
                                        // if (players.stats.length <= 10) {
                                        //     player_row_1 += '```';
                                        //     for (var i = 1; i <= players.stats.length; i++) {
                                        //         player_row_1 += `[#${i}] ${players.stats[i - 1].player}\n`;
                                        //     }
                                        //     player_row_1 += '```';
                                        // } else {
                                        //     player_row_1 += '```';
                                        //     player_row_2 += '```';
                                        //     player_row_3 += '```';
                                        //     var sizebyrow = parseInt(players.stats.length / 3);
                                        //     for (var i = 1; i <= players.stats.length; i++) {
                                        //         if (i < sizebyrow) {
                                        //             player_row_1 += `[#${i}] ${players.stats[i - 1].player}\n`;
                                        //         } else if (i < (sizebyrow * 2)) {
                                        //             player_row_2 += `[#${i}] ${players.stats[i - 1].player}\n`;
                                        //         } else {
                                        //             player_row_3 += `[#${i}] ${players.stats[i - 1].player}\n`;
                                        //         }
                                        //     }
                                        //     player_row_1 += '```';
                                        //     player_row_2 += '```';
                                        //     player_row_3 += '```';
                                        // }
                                        // const player_embed = {
                                        //     color: 0x0099ff,
                                        //     fields: [
                                        //         {
                                        //             name: `__Jugadores__`,
                                        //             value: player_row_1,
                                        //             inline: true,
                                        //         },
                                        //         {
                                        //             name: `᲼`,
                                        //             value: player_row_2,
                                        //             inline: true,
                                        //         },
                                        //         {
                                        //             name: `᲼`,
                                        //             value: player_row_3,
                                        //             inline: true,
                                        //         },
                                        //     ],
                                        //     timestamp: new Date().toISOString(),
                                        //     footer: {
                                        //         text: 'Hellelu',
                                        //     },
                                        // };

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

                                        conexion.query("SELECT * FROM `seguimiento_jugador` ", function (error, results, fields) {
                                            if (error) throw error;

                                            var field_one_data = '';
                                            var field_two_data = '';
                                            var field_three_data = "";

                                            const style = '';

                                            var clan_players_steamid = [];
                                            var clan_players_steamname = [];
                                            var clan_players_status = [];
                                            var clan_players_stats = [];

                                            results.forEach(result => {
                                                clan_players_steamid.push(result.steam_id);
                                                clan_players_steamname.push(`> ` + style + result.steam_username + style);
                                                clan_players_stats.push(style + '0 Kills 0 Deaths 0 TeamKills' + style);
                                                // clan_players_status.push("<:offline:1085569712483729438>");
                                                clan_players_status.push(style + '`🔴`' + style);
                                            });

                                            console.log(clan_players_steamid);
                                            console.log(clan_players_status);

                                            for (var i = 0; i < players.stats.length; i++) {
                                                for (var j = 0; j < clan_players_steamid.length; j++) {
                                                    if (style + players.stats[i].steam_id_64 + style == clan_players_steamid[j]) {
                                                        clan_players_status[j] = style + '`🟢`' + style;
                                                        clan_players_stats[j] = style + `${players.stats[j].kills} Kills ${players.stats[j].deaths} Deaths ${players.stats[j].teamkills} TeamKills ` + style;
                                                        if (`> ` + style + players.stats[i].player + style != clan_players_steamname[j])
                                                            conexion.query("UPDATE `seguimiento_jugador` set `steam_username`='" + players.stats[i].player + "' WHERE `steam_id`='" + clan_players_steamid[j] + "' ");
                                                    }
                                                }
                                            }

                                            field_one_data += clan_players_steamname.join(`\n`);
                                            field_two_data += clan_players_stats.join(`\n`);
                                            field_three_data += clan_players_status.join(`\n`);

                                            const player_embed = {
                                                color: 0x0099ff,
                                                fields: [
                                                    {
                                                        name: `__Jugadores__`,
                                                        value: `\n` + field_one_data,
                                                        inline: true,
                                                    },
                                                    {
                                                        name: `__Stats In-Game__`,
                                                        value: `\n` + field_two_data,
                                                        inline: true,
                                                    },
                                                    {
                                                        name: `᲼`,
                                                        value: `\n` + field_three_data,
                                                        inline: true,
                                                    },
                                                ],
                                                timestamp: new Date().toISOString(),
                                                footer: {
                                                    text: 'Hellelu',
                                                },
                                            };

                                            // field_one_data = clan_players[0]

                                            // players.forEach(player => {
                                            //     clan_players.forEach(clan_player => {
                                            //         if (player.steam_id_64 == clan_player[0]) {
                                            //             field_one_data += `${player.player}\n`;
                                            //             field_two_data += `${player.kills}\n`;
                                            //             field_three_data += `${(clan_player[2] == "offline") ? '<:offline:1085569712483729438>' : '<:online:1085569715436519485>'} `;
                                            //         }
                                            //     });
                                            // });

                                            const row = new ActionRowBuilder()
                                                .addComponents(
                                                    new ButtonBuilder()
                                                        .setCustomId('get_live_players')
                                                        .setLabel('Ver Jugadores')
                                                        .setStyle(ButtonStyle.Primary)
                                                        .setEmoji('👨‍👩‍👦')
                                                );

                                            // channel.send({ embeds: [exampleEmbed] });
                                            channel.messages.fetch(message_param).then(message => {
                                                message.edit({ embeds: [exampleEmbed, player_embed] });
                                            }).catch(err => {
                                                console.error(err);
                                            });

                                            conexion.end();

                                        });

                                        client_param.user.setActivity(`${server.current_map.just_name} | 👨‍👩‍👦 ${server.player_count} /${server.max_player_count}`, {
                                            type: ActivityType.Watching,
                                        });

                                    } catch (error) {
                                        console.log(error);
                                    }
                                });
                            }).on("error", (error) => {
                                console.error(error);
                            });
                        } catch (error) {
                            console.log(error);
                        }
                    });
                }).on("error", (error) => {
                    console.error(error.message);
                });

            } catch (error) {
                console.log(error);
            }

        }, 10000);
    }

}