/*jshint esversion: 6 */

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


router.get('/:tipo/:cs/:fd/:fh', function(req, res, next) {

        var cs = req.params.cs;
        var fd = req.params.fd;
        var fh = req.params.fh;
        var tipo = req.params.tipo;

        switch(tipo){

            case 'totales':{
                getTotales(cs,fd,fh,res);
            }

                break;

            case 'origenes':{
                getOrigenesDerivados(cs,fd,fh,res);
            }

                break;

            case 'especialidades':{
                getEspecialidades(cs,fd,fh,res);
            }

                break;

            default: {
                res.send('error');
            }
        }
    });


    function getEspecialidades(cs,fd,fh,res){

        sql.connect(config, err => {
            
            new sql.Request()

                .input('cs', sql.Int, cs)
                .input('fd', sql.Date, fd)       
                .input('fh', sql.Date, fh)
                .execute('spGetProturEspecialidades', (err, result) => {

                    if(err){
                        console.log(err);
                        res.send('error');

                    }else{

                        res.send(result);
                    }
            });
        });

    
        sql.on('error', err => {

            console.log(err);
            res.send('error');

        });
    }


    function getTotales(cs,fd,fh,res){

        sql.connect(config, err => {
            
            new sql.Request()
                .input('cs', sql.Int, cs)
                .input('fd', sql.Date, fd)
                .input('fh', sql.Date, fh)
                .execute('spGetProturTotalesPorCS', (err, result) => {

                    if(err){

                        console.log(err);
                        res.send('error');
                    }else{

                        res.send(result);
                    }
            });
        });

    
        sql.on('error', err => {

            // ... error handler
            console.log("ERROR");
            console.log(err);

            res.send('error');
        });

    }

    

    function getOrigenesDerivados(cs,fd,fh,res){

        sql.connect(config, err => {

                new sql.Request()

                    .input('cs', sql.Int, cs)
                    .input('fd', sql.Date, fd)
                    .input('fh', sql.Date, fh)
                    .execute('spGetProturDerivado', (err, result) => {

                        if(err){
                            console.log(err);
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
    }


module.exports = router;