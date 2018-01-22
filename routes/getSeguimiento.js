var express = require('express');
var router = express.Router();
var sql = require('mssql');

var config = {
    user: 'sa',
    password: 'Alamitos+2016',
    server: '10.64.65.200',
    port: 5000,
    parseJSON: true,
    database: 'MSP-Ares',
    //tuve que subirle el timeout por la lentitud de la consulta a la db
    connectionTimeout: 300000,
    requestTimeout: 300000
};


router.get('/:fechaDesde/:fechaHasta', function(req, res, next) {

    var fd = req.params.fechaDesde;
    var fh = req.params.fechaHasta;

    sql.connect(config, err => {



        var queryString = "SELECT      \n" +
        "        pr.FP       AS 'atencion',\n" +
        "        pr.CS       AS 'csOrigen',\n" +
        "        es.Nombre   AS 'esp',\n" +
        "        ta.Descripcion AS 'admision',\n" +
        "        em.Descripcion AS 'csDestino'\n" +
        "FROM    [MSP-Ares].dbo.proturregistros pr \n" +
        "        JOIN regprof.dbo.paciente pa \n" +
        "            ON pa.numerodocumento = pr.dp \n" +
        "        JOIN regprof.dbo.turno tu \n" +
        "            ON tu.pacienteid = pa.pacienteid \n" +
        "        JOIN regprof.dbo.turnoencabezado te \n" +
        "            ON te.turnoid = tu.turnoid \n" +
        "        JOIN [MSP-Ares].dbo.Especialidad es\n" +
        "            ON pr.ET = es.ID\n" +
        "        JOIN RegProf.dbo.TipoAdmision ta\n" +
        "            ON ta.TipoAdmisionId = te.TipoAdmisionID\n" +
        "        JOIN RegProf.dbo.Empresa em\n" +
        "            ON tu.EmpresaID = em.EmpresaID\n" +
        "WHERE   CONVERT(VARCHAR(10), te.fechaadmision, 127) = pr.fp \n" +
        "        AND pr.DC BETWEEN '"+ fd +"' AND '"+ fh +"'";

        new sql.Request().query(queryString, (err, result) => {

            if(err){

                console.dir(err);
                res.send('error');

            }else{

                //res.send(result);
                //console.log(result)
                process(result,res);

            }
        });
    });

    sql.on('error', err => {

        // ... error handler
        console.log(err);
        res.send('error');

    });
});

router.get('/getProturSinTurno', function(req, res, next) {

    sql.connect(config, err => {

        var queryString = "SELECT * FROM  [MSP-Ares].dbo.Especialidad";

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
    });
});

//array con el nombre de los centros de salud por nombre
const centrosDeSalud = {

    1: "HTAL. DR. GUILLERMO RAWSON",
    2:"SERVI.DE PEDIATRIA DR. JUAN CARLOS NAVARRO",
    3:"HTAL. DR. MARCIAL QUIROGA",
    4:"CAP-CAPS Dr. Alfonso Barassi- CAPITAL",
    5:"CAP-CAPS Las Margaritas",
    6:"CH-CAPS Monseñor Ricardo Báez Laspiur",
    7:"CH-CAPS Dr. Ramón Carrillo",
    8:"CH-CAPS Madre Teresa de Calcuta",
    9:"CH-CAPS Francisco González Fernández",
    10:"CH-CAPS Dr. Jorge Raúl Ruiz Aguilar",
    11:"CH-CIC B° Los Andes",
    12:"CH-CAPS San Patricio",
    13:"CH-CAPS Costanera Norte",
    14:"CH-CAPS José Ruiz",
    15:"CH-CAPS DR. Jorge Humberto Mira",
    16:"9J-CAPS Dr. Carlos Bouthery",
    17:"9J-CAPS Arturo Cabral de la Colina",
    18:"SL-CAPS Dr. Horacio Antonio Grillo",
    19:"SL-CAPS V° Marini",
    20:"SL-CAPS V° Don Arturo",
    21:"SL-CAPS V° María",
    22:"SL-CAPS Dr. Emilio Galdeano",
    23:"SL-CAPS V° Urquiza",
    24:"SL-CAPS V° Mariano Moreno",
    25:"SM-MICRO HTAL. Stella Molina- SAN MARTÍN",
    26:"SM-CAPS Antonio Cordero- CIC Dos Acequias",
    27:"SM-CAPS Arnoldo Janssen- CIC la Puntilla",
    28:"SM-CAPS B° Independencia",
    29:"SM-CAPS Ejército de los Andes",
    30:"ANG-HTAL. Dr. Alfredo Rizo Esparza- ANGACO",
    31:"ANG-CAPS Campo de Batalla",
    32:"ANG-CAPS El Bosque",
    33:"ANG-CAPS Las Tapias- CIC Angaco",
    34:"VF-HTAL. Dr. Alejandro Albarracín- VALLE FÉRTIL",
    35:"VF-CAPS Astica",
    36:"VF-CAPS Sierras de Riveros",
    37:"VF-CAPS Chucuma",
    38:"VF-CAPS Segundo Teodoro Elizondo",
    39:"VF-CAPS USNO",
    40:"VF-CAPS Baldes de Rosario",
    41:"VF-POSTA Baldecitos",
    42:"VF-POSTA Baldes de Astica",
    43:"VF-POSTA La Majadita",
    44:"VF-POSTA Los Bretes",
    45:"VF-POSTA Agua Cercada",
    46:"VF-POSTA Baldes de Funes",
    47:"VF-POSTA Baldes de las Chilcas",
    48:"VF-POSTA Baldes del Sur de Chucuma",
    49:"VF-CAPS Sierras de Elizondo",
    50:"CAU-HTAL. Dr. Cesar Aguilar- CAUCETE",
    51:"CAU-CAPS Dr. Raúl Alonso Fuego",
    52:"CAU-CAPS Pie de Palo",
    53:"CAU-CAPS Vallecito",
    54:"CAU-CAPS Guadalupe",
    55:"CAU-CAPS Marayes",
    56:"CAU-CAPS Agustín Roscelli",
    57:"CAU-POSTA Virgen de la Paz",
    58:"CAU-CAPS Bermejo",
    59:"CAU-CAPS Pozo de los Algarrobos",
    60:"25M-MICR HTAL. Santa Rosa- 25 DE MAYO",
    61:"25M-(Ex Sierra de Chávez)",
    62:"25M-POSTA La Planta",
    63:"25M-CIC 25 de Mayo",
    64:"25M-CAPS Domingo Ramón Cejas",
    65:"25M-(Ex Las Casuarinas)",
    66:"25M-CIC La Chimbera- CAPS La Chimbera",
    67:"25M-CAPS Tupelí- CIC Tupelí",
    68:"25M-CAPS Pascual Chena",
    69:"25M-CAPS V° La Salud",
    70:"25M-CIC Encón- CAPS Encón",
    71:"25M-POSTA Las Trancas",
    72:"25M-POSTA Punta del Agua",
    73:"AL-HTAL. José Giordano- ALBARDON",
    74:"AL-CAPS Dr. Francisco Giuliano- CIC Campo Afuera",
    75:"AL-CAPS La Cañada",
    76:"AL-CIC La Laja",
    77:"AL-CAPS El Rincón",
    78:"AL-CAPS Las Lomitas",
    79:"AL-POSTA Las Tierritas",
    80:"AL-CIC Albardon",
    81:"AL-CAPS las tapias",
    82:"J-HTAL. San Roque- JÁCHAL",
    83:"J-HTAL. Buenaventura Luna- Huaco- JÁCHAL",
    84:"J-POSTA Tamberías",
    85:"J-CIC San Isidro",
    86:"J-POSTA Tres Esquinas",
    87:"J-POSTA Gran China",
    88:"J-CIC V° Mercedes",
    89:"J-POSTA Entre Ríos",
    90:"J-POSTA Árbol Verde",
    91:"J-POSTA La Represa",
    92:"J-CIC Pampa Vieja",
    93:"J-CIC Mogna",
    94:"J-CIC Niquivil",
    95:"J-POSTA San Roque",
    96:"IG-HTAL. Tomás Perón- IGLESIA",
    97:"IG-CAPS Angualasto",
    98:"IG-CAPS Bella Vista",
    99:"IG-CIC Las Flores- CAPS Dr. Juan A. Carbajal",
    100:"IG-CAPS Villa Iglesia",
    101:"IG-CAPS Tudcum",
    102:"IG-CAPS Colola",
    103:"IG-POSTA Maliman (Atención solo jueves c/ 15 días)",
    104:"IG-POSTA Colanguil (Atención solo jueves c/15 días)",
    105:"RIV-CAPS San Justo",
    106:"RIV-CAPS Lote Hogar N° 3",
    107:"RIV-CAPS Materno Infantil Domingo Raimundo",
    108:"RIV-CAPS Docentes Sanjuaninos",
    109:"RIV-CAPS B° Rivadavia Sur- Dr. René Favaloro",
    110:"RIV-CAPS B° Rivadavia Sur- Dr. René Favaloro T.T",
    111:"RIV-CAPS B° Aramburu",
    112:"RIV-CAPS B°Aramburu Turno Tarde",
    113:"RIV-CAPS B° Parque Rivadavia Norte",
    114:"RIV-CAPS B° Parque Rivadavia Norte turno Tarde",
    115:"RIV-CAPS Rodríguez Pinto",
    116:"RIV-CAPS La Bebida",
    117:"RIV-CAPS La bebida Turno Tarde",
    118:"RIV-CAPS Rolando Conturso- Lote Hogar N° 53",
    119:"ULL-CAPS Ullum",
    120:"ULL-CIC Ullum",
    121:"ULL-CAPS Alejandro Royón",
    122:"CAL-HTAL. Aldo Cantoni",
    123:"CAL-HTAL. Barreal",
    124:"CAL-CAPS Tamberías",
    125:"CAL-CAPS Sorocayense",
    126:"CAL-CAPS V° Nueva",
    127:"CAL-CAPS Puchuzum",
    128:"ZON-CAPS Zonda",
    129:"ZON-CIC Zonda",
    130:"RAW-CARF (Centro de Adiestramiento René Favaloro)- RAWSON",
    131:"RAW-CAPS 12 de Octubre",
    132:"RAW-CAPS Monseñor D’Stéfano",
    133:"RAW-CAPS Maurín Navarro",
    134:"RAW-CAPS Martín Güemes",
    135:"RAW-CIC- CAPS V° Angélica",
    136:"RAW-CAPS Dr. Elio Cantoni",
    137:"RAW-CAPS Capitán Lazo",
    138:"RAW-CAPS B° Búbica- Ex V° Quintián",
    139:"RAW-CAPS Cristo Rey",
    140:"RAW-CIC Médano de Oro",
    141:"RAW-CAPS Colonia Rodas",
    142:"RAW-CIC V° Krause",
    143:"POC-HTAL. Dr. Federico Cantoni- POCITO",
    144:"POC-CAPS V° Huarpes",
    145:"POC-CAPS V° Paolini",
    146:"POC-CIC Pocito",
    147:"POC-CAPS V° Constitución",
    148:"POC-CAPS Lote Hogar N° 27",
    149:"POC-CAPS Dr. Raúl Alonso Fuego",
    150:"POC-CAPS Joaquín Uñac",
    151:"POC-CAPS Aldo Hermosilla",
    152:"POC-CAPS B° Municipal",
    153:"POC-CAPS B° Chubut",
    154:"POC-CAPS Dr. Bracco",
    155:"SAR-MICRO-HTAL Los Berros-SARMIENTO",
    156:"SAR-HTAL. Ventura Lloveras- SARMIENTO",
    157:"SAR-CIC Mediagua",
    158:"SAR-CAPS Punta del Médano",
    159:"SAR-CIC- CAPS Cochagual Norte",
    160:"SAR-CAPS Cerro de Valdivia/ Colonia Fiscal",
    161:"SAR-CAPS La Cílvica- Cochahual Sur",
    162:"SAR-CAPS Las Lagunas",
    163:"SAR-CAPS Tres Esquinas",
    164:"SAR-CAPS San Carlos",
    165:"SAR-MICRO HTAL. Los Berros",
    166:"SAR-CIC Los Berros",
    167:"SAR-POSTA Pedernal",
    168:"SAR-POSTA Divisadero",
    169:"SAR-POSTA Cienaguita",
    170:"SAR-POSTA Retamito",
    171:"SAR-POSTA Cañada Honda",
    172:"SAR-POSTA Huanacache",
    173:"SAR-CAPS Río Blanco",
    174:"Otros"

};

//agrega el nombre de los centros de salud antes de enviarlos
function process(data,res){

    for(var index in data){

        data[index].csnombre = centrosDeSalud[data[index].csOrigen];
    }
    
    res.send(data);
}


module.exports = router;