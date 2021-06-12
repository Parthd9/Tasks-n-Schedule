const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://admin_tns:<PASSWORD>@cluster0.3s6jw.mongodb.net/task-n-schedule?retryWrites=true&w=majority",
    { useUnifiedTopology: true }
  )
    .then((client) => {
      console.log("connected");
      _db = client.db(); // store the connection of database in this variable
      callback();
    })
    .catch((err) => {
      console.log("Error while establishing connection:", err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
