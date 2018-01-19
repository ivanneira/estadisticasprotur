var dataset;

var totales = {};

$(function(){



    $('#datepicker-container input').datepicker({
        format: "yyyy-mm-dd",
        language: "es",
        orientation: "bottom auto",
        autoclose: true,
        todayHighlight: true
    });

    $("#mostrarSeguimiento").click(function(){


            var fd = $('#dateDesde').val();
            var fh = $('#dateHasta').val();

            $(".datablock").hide();
            $("#waiting").modal('show');

            $.ajax({
                url: '/getSeguimiento/' + fd + '/' + fh,
                method: 'GET',
                success: function(data){
        
                    organizador(data);
        
                }
        
            });
            
        });

});


function organizador(data){

    dataset = data;

    //console.log(dataset);
    

    async.series([
            function(callback){
                filltotales(dataset);
                callback();
            },
            function(callback){
                fillTable(dataset); 
                callback();
            }
        ],
        function(err,results){

            console.dir(totales);
            $(".datablock").show();
            $("#waiting").modal('hide');

    });
}

function fillTable(data){


}

function filltotales(data){

    var totalDeRegistros = 0;

    var especialidades = [];
    var admision = [];
    var csnombre = [];
    var csDestino = []
    var especialidadesHGR = [];
    var especialidadesHMQ = [];
    var admisionHGR = [];
    var admisionHMQ = [];

    
    for (var index in data){

        totalDeRegistros++;

        especialidades[data[index].esp] = 1 + (especialidades[data[index].esp] || 0);
        admision[data[index].admision] = 1 + (admision[data[index].admision] || 0);
        csnombre[data[index].csnombre] = 1 + (csnombre[data[index].csnombre] || 0);
        csDestino[data[index].csDestino] = 1 + (csDestino[data[index].csDestino] || 0);


        if(data[index].csDestino == "HPGD Dr. Guillermo Rawson"){

            especialidadesHGR[data[index].esp] = 1 + (especialidadesHGR[data[index].esp] || 0);
            admisionHGR[data[index].admision] = 1 + (admisionHGR[data[index].admision] || 0);
        }else{

            especialidadesHMQ[data[index].esp] = 1 + (especialidadesHMQ[data[index].esp] || 0);
            admisionHMQ[data[index].admision] = 1 + (admisionHMQ[data[index].admision] || 0);
        }
    }

    totales.totalDeRegistros = totalDeRegistros;
    totales.especialidades = especialidades;
    totales.admision = admision;
    totales.csOrigen = csnombre;
    totales.csDestino = csDestino;
    totales.especialidadesHGR = especialidadesHGR;
    totales.especialidadesHMQ = especialidadesHMQ;
    totales.admisionHGR = admisionHGR;
    totales.admisionHMQ = admisionHMQ;

}

function sortData(data){

    return data.sort(function(a, b) {
            return a[1] - b[1];
        });

}


function countData(obj) {
    var count=0;
    for(var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            ++count;
        }
    }
    return count;
} 




// temp1.sort(function(a, b) {
//     return b[1] - a[1];
// });

// function count(obj) {
//     var count=0;
//     for(var prop in obj) {
//         if (obj.hasOwnProperty(prop)) {
//             ++count;
//         }
//     }
//     return count;
// } 

// var counts = {};
// for (var i = 0; i < arr.length; i++) {
//     counts[arr[i]] = 1 + (counts[arr[i]] || 0);
// }