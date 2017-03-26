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


server.route({
    method: 'GET',
    path:'/protected', 
    handler: function (request, reply) {
        return reply('This is protected.').code(401);
    }
});

server.route({
    method: 'GET',
    path:'/strings/upper',
    handler: function (request, reply) {
        var val = request.query.value
        return reply(val.toUpperCase());
    }
});

server.route({
    method: 'GET',
    path:'/strings/reverse',
    handler: function (request, reply) {
        var str = request.query.value
        var reverse = "";
        for (var i = str.length - 1; i >= 0; i--){
            reverse += str[i];
        } 
        return reply(reverse);
    },
});

server.route({
    method: 'GET',
    path:'/strings/concatenate',
    handler: function (request, reply) {
        var val = request.query.value
        var num = request.query.times
        var newstr = "";
        for(var i = 0; i < num; i++){
            newstr += val;
        }
        return reply (newstr);
    }
});

// Start the server
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
