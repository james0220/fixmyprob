'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: process.env.HOST || '0.0.0.0', 
    port: process.env.PORT || 8000
});

// Add the route

server.route({
    method: 'GET',
    path:'/', 
    handler: function (request, reply) {
        return reply('Homepage');
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
