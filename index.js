const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

let connection;

function handleDisconnect() {
  connection = mysql.createConnection({
    host: 'mysql-ayatemas-ayat-emas.l.aivencloud.com',
    port: 20829,
    user: 'avnadmin',
    password: 'AVNS_bfXGEmHApXm9Xzk5RtC',
    database: 'db_ayatemas',
  });

  // Attempt to connect
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      setTimeout(handleDisconnect, 2000); // Reattempt connection after 2 seconds
    } else {
      console.log('Database connected successfully');
    }
  });

  // Handle connection errors
  connection.on('error', (err) => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Reconnecting to database...');
      handleDisconnect(); // Reconnect if connection was lost
    } else {
      throw err; // Throw other errors
    }
  });
}

// Initialize connection
handleDisconnect();

/* Middleware */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});
app.use(bodyParser.json());

/* Start server */
app.listen(process.env.PORT || 3000, function () {
  console.log(
    'Express server listening on port %d in %s mode',
    this.address().port,
    app.settings.env
  );
});

/* API endpoint */
app.get('/getAyatEmas', (req, res) => {
  const sql = 'SELECT * FROM tbl_ayat';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});
