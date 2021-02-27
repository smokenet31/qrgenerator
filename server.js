const
  bodyParser = require('body-parser'),
  QRCode = require('qrcode'),
  express = require('express');

var app = express();
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use("/static", express.static(__dirname + '/static'));

// Server frontpage
app.get('/', function(req, res) {
  let textToEncode = 'Hola Mundo';
  generateBase64QR(textToEncode, function(qrGenerated){
    res.render("index", qrGenerated);
  });
});

app.get('/:link', function(req, res) {
  var qrLink = req.params.link;  
  console.log("Show Link: " + qrLink);
  generateBase64QR(qrLink, function(qrGenerated){
    res.render("index", qrGenerated);
  });
});

function generateBase64QR(linkToEncode, callback){
  console.log("Encode: " + linkToEncode);
  QRCode.toDataURL(linkToEncode, function (err, codeByte) {
    if(err){
       res.status(500);
       res.json({message:"No se pudo generar el codigo", error: err});
    }

    console.log(codeByte);
    return callback({qr: {img:codeByte,text: linkToEncode}});
  })
}

app.listen(app.get('port'), function() {
  console.log('Odisea 2020 web running on port ', app.get('port'));
});

module.exports = app;
