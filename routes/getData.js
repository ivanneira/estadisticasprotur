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

            default: {

                res.send('error');
            }

        }

    });



    function getTotales(cs,fd,fh,res){

            res.send('totales');

    }

    

    function getOrigenesDerivados(cs,fd,fh,res){

        sql.connect(config, err => {

                new sql.Request()

                    .input('cs', sql.Int, cs)

                    .input('fd', sql.Date, fd)

                    .input('fh', sql.Date, fh)

                    //.output('output_parameter', sql.VarChar(50))

                    .execute('spGetProturDerivado', (err, result) => {

                        // ... error checks

                        console.log(err);

                        if(err){

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



/*

router.get('/:cs',function(req, res, next){



    sql.connect(config, err => {

        // ... error checks

        

        var cs = req.params.cs;



        new sql.Request().query('SELECT count(*) FROM ProturRegistros WHERE D', (err, result) => {

            // ... error checks

    

            if(err){

    

                console.dir(err)

                res.send('error');

            }else{

                res.send(result);

            }

    

        })

   

    

        });

    

        sql.on('error', err => {

            // ... error handler

            console.log(err);

            res.send('error');

        })

});



router.get('/:cs/:fd/:fh', function(req, res, next) {

  //res.render('index', { title: 'encuesta PROTUR' });



  var cs = req.params.cs;

  var fd = req.params.fd;

  var fh = req.params.fh;



  console.log(cs)

  console.log(fd)

  console.log(fh)







});*/



/*

router.get('/:cs/:fd/:fh', function(req, res, next) {



    console.log(req)



    var cs = req.params.cs;

    console.log(cs)

    res.send('fruta');



});

*/





module.exports = router;











//------------------------------------------------------------------------

// var express = require('express');

// var router = express.Router();



// var sql = require('mssql');



// var config = {

//     user: 'sa',

//     password: 'Alamitos+2016',

//     server: '10.64.65.200', // You can use 'localhost\\instance' to connect to named instance

//     port: 5000,

//     parseJSON: true,

//     database: 'MSP-Ares'

// };

// /*

// router.get('/:cs/:fd/:fh', function(req, res, next) {



//     console.log(req)



//     var cs = req.params.cs;

//     console.log(cs)

//     res.send('fruta');



// });

// */



// router.get('/:cs/:fd/:fh', function(req, res, next) {

//   //res.render('index', { title: 'encuesta PROTUR' });



//   var cs = req.params.cs;

//   var fd = req.params.fd;

//   var fh = req.params.fh;



//   console.log(cs)

//   console.log(fd)

//   console.log(fh)



//   sql.connect(config, err => {

//     // ... error checks

    

//     /*

//     new sql.Request().query('select 1 as number', (err, result) => {

//         // ... error checks



//         if(err){



//             console.dir(err)

//             res.send('error');

//         }else{

//             res.send(result);

//         }



//     })*/



//     // Stored Procedure



//         new sql.Request()

//             .input('cs', sql.Int, cs)

//             .input('fd', sql.Date, fd)

//             .input('fh', sql.Date, fh)

//             //.output('output_parameter', sql.VarChar(50))

//             .execute('spGetProturDerivadoAux', (err, result) => {

//                 // ... error checks

//                 console.log(err);



//                 if(err){

//                     res.send('error');

//                 }else{

//                     res.send(result);

//                 }

                

//         });





//     })



//     sql.on('error', err => {

//         // ... error handler

//         console.log(err);

//         res.send('error');

//     })



// });

// module.exports = router;

