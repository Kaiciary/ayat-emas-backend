const express    = require('express');
const bodyParser = require('body-parser');
const mysql      = require('mysql2');
const app        = express();

//koneksi
const conn = mysql.createConnection({
  host : 'mysql-ayatemas-ayat-emas.l.aivencloud.com',
  port: 20829,
  user:'avnadmin',
  password:'AVNS_bfXGEmHApXm9Xzk5RtC',
  database:'db_ayatemas'
});

//connect  ke db 
conn.connect((err) =>{
  if(err) throw err;
  console.log('koneksi berhasil');
});


/*To handle HTTP POST request in Express.js version 4 
and above, you need to install middleware module 
called body-parser */
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});
app.use(bodyParser.json());
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

app.get('/getAyatEmas',(req,res) =>{
  let sql = "SELECT * FROM tbl_ayat";
  let query = conn.query(sql,(err,results) => {
      if(err) throw err;
      res.json(results);
  });
});