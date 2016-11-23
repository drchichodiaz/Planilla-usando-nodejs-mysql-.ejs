
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

//load routes
var empleados = require('./routes/empleados');
var app = express();

var connection  = require('express-myconnection');
var mysql = require('mysql');

// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request
-------------------------------------------*/

app.use(

    connection(mysql,{

        host: 'localhost',
        user: 'root',
        password : '',
        port : 3306, //port mysql
        database:'contabilidad'

    },'pool') //or single

);



app.get('/', routes.index);
app.get('/empleados', empleados.list);
app.get('/empleados/add', empleados.add);
app.post('/empleados/add', empleados.save);
app.get('/empleados/delete/:id', empleados.delete_empleado);
app.get('/empleados/edit/:id', empleados.edit);
app.post('/empleados/edit/:id',empleados.save_edit);
app.post('/empleados/correo',empleados.enviar);
app.get('/empleados/correo',empleados.mostrar);
app.get('/empleados/about',empleados.about);
app.get('/empleados/planilla', empleados.planilla);
app.get('/empleados/detalle/:id', empleados.detalle);

app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
