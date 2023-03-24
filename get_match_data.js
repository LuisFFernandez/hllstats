const https = require('https');
var mysql = require("mysql");
const cliProgress = require('cli-progress');
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

// CREATE MAP LIST
var conexion = mysql.createConnection({
    host: 'localhost',
    database: 'hll_stats',
    user: 'root',
    password: '',
    multipleStatements: true
});

conexion.connect(function (error) {
    if (error) {
        throw error;
    }
});

// for (var i = 1; i <= 5; i++) {
//     var url = `https://stats.hll.la/api/get_map_scoreboard?map_id=${i}`;
//     https.get(url, (res) => {
//         let body = "";
//         res.on("data", (chunk) => {
//             body += chunk;
//         });
//         res.on("end", () => {
//             try {
//                 console.log("Registro # " + i);
//                 let json = JSON.parse(body);
//                 var server = json.result;
//                 var creation_time = new Date(server.creation_time.toString()).getTime();
//                 console.log(server.id);
//                 conexion.query("INSERT INTO `partida` (`partida_id`, `start`, `end`, `creation_time`, `map`, `server`, `gamemode`) VALUES('" + server.id + "','','','" + creation_time + "','','','') ", function (error, results, fields) {
//                     if (error) throw error;
//                 }); { }
//             } catch (error) {
//                 console.log(error);
//             }
//         });
//     });
// }

// for (var i = 401; i <= 500; i++) {
//     var url = `https://stats.hll.la/api/get_map_scoreboard?map_id=${i}`;
//     https.get(url, (res) => {
//         let body = "";
//         res.on("data", (chunk) => {
//             body += chunk;
//         });
//         res.on("end", () => {
//             try {
//                 let json = JSON.parse(body);
//                 var server = json.result;
//                 console.log("Registro # " + server.id);
//                 conexion.query("INSERT INTO `mapa_raw` (`mapa_id`, `mapa`) VALUES(NULL,'" + server.map_name + "') ", function (error, results, fields) {
//                     if (error) throw error;
//                 });
//             } catch (error) {
//                 console.log(error);
//             }
//         });
//     });
// }

// GET NUMBER OF DATA
// var index_map = 1;
// console.log("COMENZANDO . . .");

// let interval = setInterval(() => {

//     var url = `https://stats.hll.la/api/get_map_scoreboard?map_id=${index_map}`;
//     var end = false;
//     https.get(url, (res) => {
//         let body = "";
//         res.on("data", (chunk) => {
//             body += chunk;
//         });
//         res.on("end", () => {
//             try {
//                 console.log("Registro # " + index_map);
//                 let json = JSON.parse(body);
//                 var server = json.result;
//                 // console.log(index_map);
//                 console.log(server.id);
//                 if (server == null)
//                     clearInterval(interval);
//                 else
//                     index_map++;
//             } catch (error) {
//                 console.log(error);
//             }
//         });
//     });

// }, 200);


// console.log(index_map);

// conexion.query("SELECT * FROM `seguimiento_jugador` ", function (error, results, fields) {
//     if (error) throw error;
// });{}

// const i = 550;
// const iterations = 100;
// var indexer = 0;
// var ended = false;

// console.log(`░░░░░░INICIANDO REGISTROS░░░░░░`);

// bar1.start(iterations, 0);

// for (var z = i; z <= (iterations + i); z++) {

//     indexer++;
//     var url = `https://stats.hll.la/api/get_map_scoreboard?map_id=${z}`;
//     https.get(url, (res) => {
//         let body = "";
//         res.on("data", (chunk) => {
//             body += chunk;
//         });
//         res.on("end", () => {
//             try {
//                 let json = JSON.parse(body);
//                 var server = json.result;
//                 // console.log(server.player_stats.length);
//                 for (var i = 0; i < server.player_stats.length; i++) {
//                     for (var j = 0; j < Object.keys(server.player_stats[i].weapons).length; j++) {

//                         // console.log(Object.keys(server.player_stats[i].weapons)[j]);
//                         conexion.query("INSERT INTO `gun_raw` (`gun_id`, `nombre`) VALUES(NULL,'" + Object.keys(server.player_stats[i].weapons)[j] + "') ", function (error, results, fields) {
//                             if (error) throw error;
//                         });

//                     }
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         });
//     });
//     bar1.update(indexer);
//     if (indexer == iterations) {
//         ended = true;
//     }
// }

// if (ended)
//     bar1.stop();

// console.log("░░░░░░Registro Terminado░░░░░░");