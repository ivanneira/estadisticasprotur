var dataset;

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
    console.log(dataset)

    async.series([
            function(callback){
                filltotales(dataset);
                callback();
            },
            function(callback){

                callback();
            }
        ],
        function(err,results){
    });
}

function filltotales(data){


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