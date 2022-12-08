import { ObjectID } from 'bson';
import express from 'express';
import client from "../data/db.js";

var router = express.Router();

const db = client.db();
const collection = db.collection('device');


/* GET devices listing. */
router.get('/', (req, res, next) => {
  client.connect().then(async () => {
    collection.find({}).toArray((err, result) => {
      if (err) throw err;
      res.status(200).send({ data: result });
    });
  })
  // client.connect().then(async () => {
  //   collection.drop(function (err, delOK) {
  //     if (err) throw err;
  //     if (delOK) console.log("Collection deleted");
  //   })
  // });
});

router.put('/', (req, res, next) => {
  var newDevice = req.body.data;
  newDevice = { ...newDevice, created: new Date(), uid: generateId() }
  client.connect().then(async () => {
    collection.insertOne(newDevice, (err, result) => {
      if (err) throw err;
      res.status(200).send({ data: result });
    });
  })
});

router.patch('/', (req, res, next) => {
  var data = req.body.data;
  var myquery = { "_id": ObjectID(data.query._id) };
  var newvalues = { $set: { ...data.set } };
  client.connect().then(async () => {
    collection.updateOne(myquery, newvalues, (err, result) => {
      if (err) throw err;
      res.status(200).send({ data: result });
    });
  })
})

router.delete('/', (req, res, next) => {
  var data = req.body.data;
  var myquery = { "_id": ObjectID(data.query._id) };
  client.connect().then(async () => {
    collection.deleteOne(myquery, (err, result) => {
      if (err) throw err;
      res.status(200).send({ data: result });
    });
  })
})

const generateId = (length = 6, phrase = '123456789') => {
  let uid = '';
  do {
    uid += phrase.charAt(Math.floor(Math.random() * (phrase.length - 1)));
  } while (length-- > 1)
  return parseInt(uid);
}

export default router;
