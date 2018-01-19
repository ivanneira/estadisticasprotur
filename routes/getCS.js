var express = require('express');

var router = express.Router();

var sql = require('mssql');


var config = {

    user: 'sa',
    password: 'Alamitos+2016',
    server: '10.64.65.200',
    port: 5000,
    parseJSON: true,
    database: 'MSP-Ares'
};


router.get('/', function(req, res, next) {

    sql.connect(config, err => {

        var queryString = 'select id,Nombre from ProturEquivalenciasCaps order by Nombre asc';

        new sql.Request().query(queryString, (err, result) => {

            if(err){

                console.dir(err);
                res.send('error');

            }else{

                res.send(result);

            }
        });
    });

    sql.on('error', err => {

        // ... error handler
        console.log(err);
        res.send('error');

    });
});


module.exports = router;