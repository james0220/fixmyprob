'use strict';

const Hapi = require('hapi');
var mysql = require('mysql');
const Hoek = require('hoek');


// WORK IN PROGRESS
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'users'
// });


// Create a server with a host and port
const server = new Hapi.Server();

server.connection({
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 8000
});

// Render templates with vision and handlebars
server.register(require('vision'), (err) => {

    Hoek.assert(!err, err);

    server.views({
        engines: {
            html: require('handlebars'),
            compileMode: 'async' // global setting
        },
        relativeTo: __dirname,
        path: './views'
    });
});


//STILL WORK IN PROGRESS; used code from exam for starter
// connection.connect(); //connect to mysql

// Add the route

// WORK IN PROGRESS FOR SERVER
// server.route({
//     method: 'GET',
//     path:'/',
//     handler: function (request, reply) {
//         connection.query('SELECT * FROM People', function (error, results, fields) {
//             if (error) throw error;
//             reply('The name is: ' + results[0].Name);
//             });
//     }
// });


// Add the route
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.view('index', { title: 'Home page' });
    }
});

// Start the server
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
