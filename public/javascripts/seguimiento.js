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
                fillTable(totales); 
                callback();
            },
            function(callback){
                fillGraph(totales); 
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

    var htmlString =    '<tr><td>' + "Total de solicitudes" + '</td><td>' + data.totalDeRegistros + '</td></tr>'+
                        '<tr><td>' + "Total de especialidades" + '</td><td>' + data.totalDeEspecialidades + '</td></tr>'+
                        '<tr><td>' + "Total de solicitudes para HGR" + '</td><td>' + data.totalDeAtencionesHGR + '</td></tr>'+
                        '<tr><td>' + "Total de solicitudes para HMQ" + '</td><td>' + data.totalDeAtencionesHMQ + '</td></tr>'

    $("#totalesBody").append(htmlString);
}

function fillGraph(data){

    //Admisiones
    var admisionChart = Highcharts.chart('admisionContainer', templateGraph(totales.admision,"Admisión","Totales de admisión"));
    var admisionHMQChart = Highcharts.chart('admisionHQContainer', templateGraph(totales.admisionHMQ,"Admisión","Hospital Marcial Quiroga"));
    var admisionHGRChart = Highcharts.chart('admisionHRContainer', templateGraph(totales.admisionHGR,"Admisión","Hospital Guillermo Rawson"));

    //especialidades
    var especialidadesChart = Highcharts.chart('especialidadesContainer', templateGraph(totales.especialidades,"Especialidades","Totales de especialidades"));
    var especialidadesHMQChart = Highcharts.chart('especialidadesHQContainer', templateGraph(totales.especialidadesHMQ,"Especialidades","Hospital Marcial Quiroga"));
    var especialidadesHGRChart = Highcharts.chart('especialidadesHRContainer', templateGraph(totales.especialidadesHGR,"Especialidades","Hospital Guillermo Rawson"));


    //console.dir(totales.especialidades)
}

function templateGraph(data, title, subtitle){

    var dataGraph = [];

    for (var index in data){

        dataGraph.push({name: index, y:data[index]});
    }

    return {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: title
        },
        subtitle: {
            text: subtitle
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y} ',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{

            data: dataGraph
        }]
    };

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
    var atencionHGR = 0;
    var atencionHMQ = 0;

    
    for (var index in data){

        totalDeRegistros++;

        especialidades[data[index].esp] = 1 + (especialidades[data[index].esp] || 0);
        admision[data[index].admision] = 1 + (admision[data[index].admision] || 0);
        csnombre[data[index].csnombre] = 1 + (csnombre[data[index].csnombre] || 0);
        csDestino[data[index].csDestino] = 1 + (csDestino[data[index].csDestino] || 0);

        //cuento los dos hospitales de primer nivel por separado
        if(data[index].csDestino == "HPGD Dr. Guillermo Rawson"){

            atencionHGR++;
            especialidadesHGR[data[index].esp] = 1 + (especialidadesHGR[data[index].esp] || 0);
            admisionHGR[data[index].admision] = 1 + (admisionHGR[data[index].admision] || 0);
        }else{
            atencionHMQ++;
            especialidadesHMQ[data[index].esp] = 1 + (especialidadesHMQ[data[index].esp] || 0);
            admisionHMQ[data[index].admision] = 1 + (admisionHMQ[data[index].admision] || 0);
        }
    }

    totales.totalDeRegistros = totalDeRegistros;
    totales.especialidades = especialidades;
    totales.totalDeEspecialidades = countData(especialidades);
    totales.admision = admision;
    totales.csOrigen = csnombre;
    totales.csDestino = csDestino;
    totales.especialidadesHGR = especialidadesHGR;
    totales.totalDeAtencionesHGR = atencionHMQ;
    totales.totalDeAtencionesHMQ = atencionHGR;
    totales.especialidadesHMQ = especialidadesHMQ;
    totales.admisionHGR = admisionHGR;
    totales.admisionHMQ = admisionHMQ;

}

// function sortData(data){

//     return data.sort(function(a, b) {
//             return a[1] - b[1];
//         });

// }


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