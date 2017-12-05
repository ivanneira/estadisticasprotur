/*jshint esversion: 6 */

var express = require('express');

var router = express.Router();

var sql = require('mssql');


var async = require('async');

var config = {

    user: 'sa',

    password: 'Alamitos+2016',

    server: '10.64.65.200',

    port: 5000,

    parseJSON: true,

    database: 'MSP-Ares'

};


router.get('/', function(req, res, next) {

    var tipo = req.params.tipo;

    loadData(res);

});

function loadData(res){

    var data = [];

    async.series({

        totalderegistros: function(callback){

            sql.connect(config, err => {
                
                // ... error checks
        
                new sql.Request().query("SELECT COUNT(*) AS registros, \n" +
                "			 COUNT(DISTINCT(PT)) AS protur, \n" +
                "			 COUNT(DISTINCT(CS)) AS cs, \n" +
                "			 CONVERT(VARCHAR,dateadd(second, MIN(TS) /1000 + 8*60*60, '19700101'), 103) AS desde, \n" +
                "			 CONVERT(VARCHAR, dateadd(second, MAX(TS) /1000 + 8*60*60, '19700101'),103) AS hasta ,\n" +
                "			(SELECT COUNT(*) FROM ProturRegistros WHERE TT = 1) AS derivados,\n" +
                "			(SELECT COUNT(*) FROM ProturRegistros WHERE TT = 2) AS interconsultas,\n" +
                "			(SELECT COUNT(*) FROM ProturRegistros WHERE TT = 3) AS espontaneas,\n" +
                "			(SELECT COUNT(*) FROM ProturRegistros WHERE TT = 4) AS transitos,\n" +
                "			(SELECT COUNT(*) FROM ProturRegistros WHERE TA=0 AND PE=1) AS programados,\n" +
                "			(SELECT COUNT(*) FROM ProturRegistros WHERE TA=0 AND PE=0) AS noresueltos,\n" +
                "			(SELECT COUNT(*) FROM ProturRegistros WHERE TA=1) AS atendidos\n" +
                "FROM ProturRegistros", (err, result) => {
        
                    // ... error checks
                    if(err){
        
                        console.dir("Error de acceso a la base de datos " + err);
                        res.send('error');
        
                    }else{

                        callback(null,result[0]);
                    }
                });
            });
        }
    },
        function(err,results){

            //console.log(results);
            res.send(results);
        }
    );

    sql.on('error', err => {

        // ... error handler
        console.log(err);
        res.send('error');

    });

}


module.exports = router;