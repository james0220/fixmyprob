'use strict';

const Hapi = require('hapi');
var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'users'
});


// Create a server with a host and port
const server = new Hapi.Server();

server.connection({ 
    host: process.env.HOST || '0.0.0.0', 
    port: process.env.PORT || 8000
});


//STILL WORK IN PROGRESS; used code from exam for starter
connection.connect(); //connect to mysql
// Add the route

server.route({
    method: 'GET',
    path:'/', 
    handler: function (request, reply) {
        connection.query('SELECT * FROM People', function (error, results, fields) {
            if (error) throw error;
            reply('The name is: ' + results[0].Name);
            });
    }
});

// Start the server
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
