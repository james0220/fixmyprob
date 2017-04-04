'use strict';

const Hapi = require('hapi');
// var mysql = require('mysql');
const Inert = require('inert');
var Joi = require('joi');
var Bcrypt = require('bcrypt');
const pg = require('pg');

// const connectionString = process.env.DATABASE_URL || 'postgres://fbfijdagdxlzzw:70685c2563d4a7bdf11a057962e95fbdae783fabb1c62d73e482d98e08c92f96@ec2-23-21-220-188.compute-1.amazonaws.com:5432/du7btfollj81u';
//
// const client = new pg.Client(connectionString);
// client.connect();
// const query = client.query(
//   'SELECT * FROM users'
// )
//
// console.log(query);

let databaseClient = null;
// var connectionString = "postgres://fbfijdagdxlzzw:70685c2563d4a7bdf11a057962e95fbdae783fabb1c62d73e482d98e08c92f96@ec2-23-21-220-188.compute-1.amazonaws.com:5432/du7btfollj81u";

// First, we establish our database connection.
//
// Default to SSL connections
// pg.defaults.ssl = true;

pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  console.log('Connected to postgres! Getting schemas...');

    if(err){
        console.log("Error!", err);
        return;
    }

    // Connection to database ok! Now, let's start our server.
    databaseClient = client;
    client.query('SELECT email FROM users where id = 2', (err, result) => {
      console.log('QUERY WAS RUN');
      for (var i = 0; i < result.rows.length; i++) {
        console.log(result.rows[i]);
      }
    });

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
    path: '/movies/{id?}',
    handler: function (request, reply) {
        var search = request.params.id
        let select = `SELECT * FROM users WHERE id = ` + search;
        request.pg.client.query(select, function(err, result) {
            // return reply(result);
            return reply.view('movies', {'movies': result.rows});
        })
        // return reply(select);
        // request.pg.client.query(select, function(err, result) {
         // }
  }
})

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
          // First, let's verify the user inputs.
          // 1) Check if the email address is a "valid" email and then turn it
          //    into lowercase before we store it in the database.
          //    Eg. did somebody submit wootbar#foo.com as their email?
          // 2) Check to see if psw is equal to psw-repeat.
          // If the input is not valid, redirect them to the form again and show
          // some errors. Otherwise, add the user to the database.

          // If all of the input is OK, do the following...
          const sql = 'INSERT INTO users(email, password, repassword) VALUES ($1, $2, $3) RETURNING id'
          const values = [request.payload.email, request.payload.psw, request.payload['psw-repeat']];
          databaseClient.query(sql, values, function(err, result) {
            // for (var i = 0; i < result.rows.length; i++) {
            //   console.log(result.rows[i]);
            // }
          });
          reply.redirect('/');


            // Bcrypt.compare(request.payload.password, user.password, function (err, isValid) {
            //     if(!err && isValid) {
            //       reply('great success'); // or what ever you want to rply
            //     } else {
            //       reply('fail').code(400);
            //     }
            // }); // END Bcrypt.compare which checks the password is correct
          // }); // END db.get which checks if the person is in our database

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
