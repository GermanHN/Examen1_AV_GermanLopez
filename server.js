var express = require('express');
var app = express();
var mongoose= require('mongoose');
var bodyParser= require("body-parser");

var path= require("path");

app.listen(3000, function () {
  console.log('App escuchando en el puerto 3000!');
});

mongoose.connect('mongodb://admin:1234@ds135810.mlab.com:35810/examen1',{useMongoClient: true}, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'public','index.html'));
});

app.use(bodyParser.urlencoded({ extended: true }));

////////////////

//Definiendo el esquema
var productosSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    _id: Number,
    descripcion: String,
    marca: String,
    numero_estante: Number,
    fecha_ingreso: {type: Date, default: Date.now}
});

var Producto = mongoose.model('Producto', productosSchema);


//app.get('/', function (req, res) {
//   res.status(200).send('Respuesta a GET!');
//  });
  
  
  app.get('/api/productos',function (req, res){
    Producto.find(function (err, productos) {
        if (err)
            res.status(500).send('Error en la base de datos');
        else
            res.status(200).json(productos);
    });
});



app.get('/api/productos/:id',function (req, res){
    Producto.findById(req.params.id,function(err, producto)  {
        if (err)
            res.status(500).send('Error en la base de datos');
        else
            res.status(200).json(producto);
    });
});


/*
app.get('/api/productos',function (req, res){
    Producto.find({marca: req.query.marca},function(err, productos)  {
        if (err)
            res.status(500).send('Error en la base de datos');
        else
            res.status(200).json(productos);
    });
});
*/







app.delete('/api/productos/:id',function(req,res){
    //Eliminar con Find ID
    Producto.findById(req.params.id,function(err, producto) {
        if (err)
            res.status(500).send('Error en la base de datos');
        else{
            if (producto != null) {
                producto.remove(function (error, result) {
                    if (error)
                        res.status(500).send('Error en la base de datos');
                    else {
                        res.status(200).send('Eliminado exitosamente');
                    }
                });
            }
            else
                res.status(404).send('No se encontro ese artista');
        }
    });
});



app.put('/api/productos/:id',function(req,res){

    //Modificar con Find ID
    Producto.findById(req.params.id,function(err, producto) {
        if (err)
            res.status(500).send('Error en la base de datos');
        else{
            if (producto != null){
                producto.descripcion = req.body.descripcion;
                producto.marca = req.body.marca;
                producto.numero_estante = req.body.numero_estante;
                producto.fecha_ingreso = new Date(1983,05,10);

                producto.save(function (error, productos1) {
                    if (error)
                        res.status(500).send('Error en la base de datos');
                    else {
                        res.status(200).send('Modificado exitosamente');
                    }
                });
            }
            else
                res.status(404).send('No se encontro esa cancion');
        }
    });

});





app.post('/api/productos',function(req,res){
    //crea un objeto pero del modelo Productos
    var productos1 = new Producto({
        _id: req.body.id,
        descripcion: req.body.descripcion,
        marca: req.body.marca,
        numero_estante: req.body.numero_estante,
        fecha_ingreso: req.body.fecha_ingreso
       
    });
    
    //guarda una persona en la base de datos
    productos1.save(function (error, productos1) {
        if (error) {
            res.status(500).send('No se ha podido agregar.');
        }
        else {
            res.status(200).json('Agregado exitosamente'); //envía al cliente el id generado
        }
    });
});


