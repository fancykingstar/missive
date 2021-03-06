const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path');
const mysql = require('mysql');

const app = express();
const publicPath = path.join(__dirname);
app.use(cors({ origin: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(publicPath));

const connection = mysql.createConnection({
    host     : 'database-tp.c8x4w5dbwmve.eu-central-1.rds.amazonaws.com',
    database : 'sys',
    user     : 'dbuser',
    password : 'Q5Ivbkux563k',
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('Connected as id ' + connection.threadId);
});

app.post('/send', (req, res) => {
  const { id } = req.body;
  
  connection.query(`SELECT * FROM sys.tp WHERE link LIKE '%${id}'`, function (error, results, fields) {
      if (error) {
        res.status(403).send({
          data: null
        });
        throw error;
      }
  
      if (results && results.length > 0) {
        res.status(200).send({
          data: results
        });
      } else {
        res.status(200).send({
          data: []
        });
      }

      // results.forEach(result => {
      //     console.log(result);
      // });
  });

  // connection.end();
})

app.get('/test', (req, res) => {
  res.status(200).send({
    data: 'results'
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});


app.listen(4000, () => {
  console.log('Server is up!');
});
