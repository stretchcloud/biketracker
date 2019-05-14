var request = require('request');
var express = require('express');
var oracledb = require('oracledb');
var port = 4000;
var app = express();

var dbConfig;

app.listen(port, function() {
    if(process.env.dbconfig)
    {
        dbConfig = JSON.parse(process.env.dbconfig);
    } else {
        console.log("ERROR: dbconfig missing!");
    }
});

app.get('/testconnection', function(req, res) {
    console.log(dbConfig);
    oracledb.getConnection({
        user: dbConfig.dbuser,
        password: dbConfig.dbpassword,
        connectString: dbConfig.connectString
    },
    function(err, connection) {
        if (err) {
            console.log(err);
            var response = {};
            response.error = err;
            res.send(JSON.stringify(response));
        } else {    
            connection.execute('select user from dual', [], function(err, result) {
                if (err) {
                    var response = {};
                    response.error = err;
                    res.send(JSON.stringify(response));
                }
                var user = result.rows[0][0];
                connection.close(function(err) {
                    if (err) {
                        console.log(err);
                        var response = {};
                        response.error = err;
                        res.send(JSON.stringify(response));
                    } else {
                        console.log(user);
                        var response = {};
                        response.user = user;
                        res.send(JSON.stringify(response));
                    }
                });
            });
        }
    });
});