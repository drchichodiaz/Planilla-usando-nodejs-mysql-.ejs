
/*
 * GET users listing.
 */
 var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var fs =require('fs');
var formidable = require('formidable');
var multer=require('multer');

exports.enviar= function(req,res) {
console.log(req.body.destinatario+"   "+req.params.asunto+"      "+req.body.info);
        //var tipo=req.files.f.path;
        //console.log(req.files);
  var emailAddress = "nodejsContabilidad@gmail.com";
  mailOptions = {
      from: "Admin nodejsContabilidad<nodejsContabilidad@gmail.com>", // sender address
      to: req.body.destinatario, // list of receivers
      subject:req.params.asunto, // Subject line
      text: req.body.info, // plaintext body
      attachments: [{
   filename: 'pdf.pdf',
   path: 'C:/Users/rode_/Downloads/pdf.pdf',
   //contentType: 'application/pdf',
 }]
  }

  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({


host: "smtp.gmail.com",
secureConnection: false,
port: 587,
requiresAuth: true,
domains: ["gmail.com", "googlemail.com"],
auth: {
user: "nodejsContabilidad@gmail.com",
pass: "nodejs2016"
}
  });

  // setup e-mail data with unicode symbols


  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
          res.redirect('/empleados/correo',{title:'ocurrio un error en el envio'});
      }
      console.log('Message sent: ' + info.response);
      res.redirect('/empleados/correo');
  });

}
exports.mostrar= function(req,res) {
res.render('correo');
}
//***********************about
exports.about= function(req,res) {
res.render('about');
}

//**************************************
exports.planilla = function(req, res){


  req.getConnection(function(err,connection){

        var query = connection.query('SELECT * FROM empleado',function(err,rows)
        {

            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('planilla',{page_title:"Customers - Node.js",data:rows});


         });

         //console.log(query.sql);
    });


};





exports.detalle = function(req, res){

   var ID = req.params.id


   req.getConnection(function(err,connection){

       var query = connection.query('SELECT * FROM empleado WHERE id = ?',[ID],function(err,rows)
       {

           if(err)
               console.log("Error Selecting : %s ",err );

           console.log("Esta pasando por aqui 2");
           res.render('detalle',{page_title:"detalle",data:rows});


        });

        //console.log(query.sql);
   });


};


/////////////////777777
exports.list = function(req, res){

  req.getConnection(function(err,connection){

        var query = connection.query('SELECT * FROM empleado',function(err,rows)
        {

            if(err)
                console.log("Error Selecting : %s ",err );
            console.log(rows);
            res.render('empleados',{page_title:"Customers - Node.js",data:rows});


         });

         //console.log(query.sql);
    });

};

exports.add = function(req, res){
  res.render('add_empleado',{page_title:"Añadir Empleados"});
};

exports.edit = function(req, res){
    console.log("Esta pasando por aqui 1 "+ req.params.id);
    var ID = req.params.id;

    req.getConnection(function(err,connection){

        var query = connection.query('SELECT * FROM empleado WHERE id = ?',[ID],function(err,rows)
        {

            if(err)
                console.log("Error Selecting : %s ",err );

            console.log("Esta pasando por aqui 2");
            res.render('edit_empleado',{page_title:"Editar Empleados",data:rows});


         });

         //console.log(query.sql);
    });
};

/*Save the empleado*/
exports.save = function(req,res){

    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function (err, connection) {

        var data = {

            nombre    : input.nombre,
            apellido : input.apellido,
            cedula    : input.cedula,
            clave    : input.clave,
            cargo    : input.cargo,
            años    : input.años,
            salario    : input.salario,
            ventas  : input.ventas,
            otros_descuentos  : input.descuentos
        };

        var query = connection.query("INSERT INTO empleado set ? ",data, function(err, rows)
        {

          if (err)
              console.log("Error insertando : %s ",err );

          res.redirect('/empleados');

        });

       // console.log(query.sql); get raw query

    });
};

exports.save_edit = function(req,res){

    var input = JSON.parse(JSON.stringify(req.body));
    var ID = req.params.id;

    req.getConnection(function (err, connection) {

        var data = {

          nombre    : input.nombre,
          apellido : input.apellido,
          cedula    : input.cedula,
          clave    : input.clave,
          cargo    : input.cargo,
          años    : input.años,
          salario    : input.salario,
          ventas  : input.ventas,
          otros_descuentos  : input.descuentos

        };

        connection.query("UPDATE empleado set ? WHERE id = ? ",[data,ID], function(err, rows)
        {

          if (err)
              console.log("Error Updating : %s ",err );

          res.redirect('/empleados');

        });

    });
};


exports.delete_empleado = function(req,res){

     var ID = req.params.id;

     req.getConnection(function (err, connection) {

        connection.query("DELETE FROM empleado  WHERE id = ? ",[ID], function(err, rows)
        {

             if(err)
                 console.log("Error deleting : %s ",err );

             res.redirect('/empleados');

        });

     });
};
