const express = require('express')
const app = express()
const socketio = require('socket.io');
var dateFormat = require('dateformat');
var bodyParser = require("body-parser");
app.use(bodyParser.json());
var md5 = require("md5");
// const cors = require('cors');

const { Pool } = require("pg");
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'xray-dev',
  password: '11681168',
  port: 5432
})
// const pool = new Pool({
//   user: "bomberman02",
//   host: "db1.telecorp.co.th",
//   database: "Q_QueueSimpleDB",
//   password: "B@02",
//   port: 5432,
// });

app.use(function (req, res, next) {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:6012'); //หรือใส่แค่เฉพาะ domain ที่ต้องการได้
  res.setHeader('Access-Control-Allow-Origin', '*'); //หรือใส่แค่เฉพาะ domain ที่ต้องการได้
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// app.listen(9000, () => {
//   console.log('Application is running on port 9000')
// })
const server = app.listen(process.env.server || 9000, () => {
  console.log(`Server started port 9000 `)
});

// const Port = process.env.Port || 4000;
// app.listen(Port, () => console.log(`Server started on port `+ Port));

const io = socketio(server)
io.on("connection", (socketio) => {
  console.log('New User Connect', socketio.id);
  socketio.on('roomlist', (data) => {
    socketio.join(data)
    console.log(data);
  })


  socketio.on('disconnect', () => {
    console.log('disconnect');
  })
})

app.listen(function () {
  main();
  setInterval(function () {
    main();
  }, 10000);

});
async function main() {
  console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"));
}

app.get('/', (req, res) => {
  res.json({ message: 'Ahoy!' })
})



app.get("/api/counter", (req, res) => {
  counterAll(function (back) {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(back));
  });
});

app.get("/api/counter/:key", (req, res) => {
  counterNo(req.params.key, function (back) {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(back));
  });
});

app.post("/api/user", (req, res) => {
  var username = req.body.username,
    password = req.body.password;
  console.log(username + password, '555');
  if (
    typeof username == "undefined" ||
    typeof password == "undefined" ||
    !username ||
    !password
  ) {
    res.json({
      success: false,
      message: "Please enter username or password",
    });
  } else {
    var back = {};
    var input = password;
    var md5Pasword = md5(input);
    var sql = "SELECT * FROM users where username = '" + username + "' and password = '" + md5Pasword + "' ";
    pool.connect((err, client, done) => {
      client.query(sql, function (err, result, fields) {
        done();
        if (!err) {
          if (result.rowCount < 1) {
            res.json({
              success: false,
              message: "ไม่พบข้อมูล",
            });
          } else {
            res.json({
              success: true,
              message: result.rows,
            });
          }
        } else {
          res.json({
            success: false,
            message: "Authenticate fail",
          });
          // callback(back);
        }
      });
    });
  }
});

app.post("/api/doctor/login", (req, res) => {
  var username = req.body.username,
    password = req.body.password;
  console.log(username + password, '555');
  if (
    typeof username == "undefined" ||
    typeof password == "undefined" ||
    !username ||
    !password
  ) {
    res.json({
      success: false,
      message: "Please enter username or password",
    });
  } else {
    var back = {};
    var input = password;
    var md5Pasword = md5(input);
    var sql = "SELECT * FROM users where username = '" + username + "' and password = '" + md5Pasword + "' ";
    pool.connect((err, client, done) => {
      client.query(sql, function (err, result, fields) {
        done();
        if (!err) {
          if (result.rowCount < 1) {
            res.json({
              success: false,
              message: "ไม่พบข้อมูล",
            });
          } else {
            res.json({
              success: true,
              message: result.rows,
            });
          }
        } else {
          res.json({
            success: false,
            message: "Authenticate fail",
          });
          // callback(back);
        }
      });
    });
  }
});


var counterAll = function (callback) {
  var back = {};
  var sql =
    "SELECT * FROM m_counter ";
  pool.connect((err, client, done) => {
    client.query(sql, function (err, result, fields) {
      done();
      if (!err) {
        if (result.rowCount < 1) {
          back.success = false;
          back.message = "ไม่พบข้อมูล";
          callback(back);
        } else {
          back.success = true;
          back.data = result.rows;
          callback(back);
        }
      } else {
        back.success = false;
        back.message = "Authenticate fail";
        callback(back);
      }
    });
  });
};
var counterNo = function (param, callback) {
  var back = {};
  var sql =
    "SELECT * FROM m_counter where xraytype_code = '" + param + "' ";
  pool.connect((err, client, done) => {
    client.query(sql, function (err, result, fields) {
      done();
      if (!err) {
        if (result.rowCount < 1) {
          back.success = false;
          back.message = "ไม่พบข้อมูล";
          callback(back);
        } else {
          back.success = true;
          back.data = result.rows;
          callback(back);
        }
      } else {
        back.success = false;
        back.message = "Authenticate fail";
        callback(back);
      }
    });
  });
};

var tr_patientqueue = function (callback) {
  var back = {};
  var sql =
    "SELECT * FROM tr_patientqueue ";
  pool.connect((err, client, done) => {
    client.query(sql, function (err, result, fields) {
      done();
      if (!err) {
        if (result.rowCount < 1) {
          back.success = false;
          back.message = "ไม่พบข้อมูล";
          callback(back);
        } else {
          back.success = true;
          back.data = result.rows;
          callback(back);
        }
      } else {
        back.success = false;
        back.message = "Authenticate fail";
        callback(back);
      }
    });
  });
};

var staff_authenticate = function (callback) {
  var back = {};
  var sql =
    "SELECT * FROM users ";
  pool.connect((err, client, done) => {
    client.query(sql, function (err, result, fields) {
      done();
      if (!err) {
        if (result.rowCount < 1) {
          back.success = false;
          back.message = "ไม่พบข้อมูล";
          callback(back);
        } else {
          back.success = true;
          back.data = result.rows;
          callback(back);
        }
      } else {
        back.success = false;
        back.message = "Authenticate fail";
        callback(back);
      }
    });
  });
};

