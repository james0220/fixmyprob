'use strict';

const Hapi = require('hapi');
// var mysql = require('mysql');
const Inert = require('inert');
var Joi = require('joi');
var Bcrypt = require('bcrypt');
const pg = require('pg');

let databaseClient = null;

// First, we establish our database connection.
//
// Default to SSL connections
// pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if(err){
        console.log("Error!", err);
        return;
    }
    // if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  // client
  //   .query('SELECT table_schema,table_name FROM information_schema.tables;')
  //   .on('row', function(row) {
  //     console.log(JSON.stringify(row));
  //   });

    // Connection to database ok! Now, let's start our server.
    databaseClient = client;
    startServer();

});

// Create a server with a host and port
function startServer(){

    const server = new Hapi.Server();

    server.connection({
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || 8000
    });

    // Render templates with vision and handlebars
    server.register(require('vision'), (err) => {
      if (err) {
          throw err;
      }
    });

    server.register(require('inert'), (err) => {
      if (err) {
          throw err;
      }
    });

    server.views({
        engines: {
            html: require('handlebars'),
            // compileMode: 'async' // global setting
        },
        relativeTo: __dirname,
        path: './views'
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

    server.route({
        method: 'GET',
        path: '/login',
        handler: function (request, reply) {
            reply.view('login', { title: 'Login' });
        }
    });

    server.route({
        method: 'POST',
        path: '/login',
        handler: function (request, reply) {
          // Here, we will check the supplied credentials against the database.
          // If they are wrong, we show them the login form again. If they are
          // right, we do something else
            reply.view('login', { title: 'Login'});
        }
    });

    server.route({
        method: 'GET',
        path: '/signup',
        handler: function (request, reply) {
            reply.view('signup', { title: 'Sign Up' });
        }
    });

    server.route({
        method: 'POST',
        path: '/signup',
        handler: function (request, reply) {
          db.get(request.payload.email, function(err, res) { // GENERIC DB request. insert your own here!
            if(err) {
              reply('fail').code(400);
            }
          });
            Bcrypt.compare(request.payload.password, user.password, function (err, isValid) {
                if(!err && isValid) {
                  reply('great success'); // or what ever you want to rply
                } else {
                  reply('fail').code(400);
                }
            }); // END Bcrypt.compare which checks the password is correct
          // }); // END db.get which checks if the person is in our database

          // var email = request.payload.email
          // console.log(email);
          // if (email = 'jk')
          // {
          //   console.log('Success!');
            // return res.redirect('/');
      }
  //       config: {
  //         validate: {
  //           payload: {
  //             email: Joi.string().email().required(),
  //               // password: Joi.string().password.min(2).max(200).required()
  //   }
  // },
            // reply.view('signup', { title: 'Sign Up'});
  });


    // Attempting to get images to render

    server.route({
        method: 'GET',
        path: '/styles.css',
        handler: function (request, reply) {
          reply.file('./views/css/styles.css');
        }
    });

    server.route({
        method: 'GET',
        path: '/icon.png',
        handler: function (request, reply) {
          reply.file('./views/img/icon.png');
        }
    });

    server.route({
        method: 'GET',
        path: '/avatar.png',
        handler: function (request, reply) {
          reply.file('./views/img/avatar.png');
        }
    });

    server.route({
        method: 'GET',
        path: '/header.png',
        handler: function (request, reply) {
          reply.file('./views/img/header.png');
        }
    });

    // Start the server
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
};
