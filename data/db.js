import { MongoClient } from 'mongodb';

var url = "mongodb://localhost:27017/practicalTask";
const client = new MongoClient(url);

client.connect((err, db) => {
  if (err) throw err;
  console.log("Database created! ");
  db.close();
});

export default client;
