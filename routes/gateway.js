import { ObjectID } from 'bson';
import express from 'express';
import { v1 } from 'uuid';
import client from "../data/db.js";

var router = express.Router();

const db = client.db();
const collection = db.collection('gateway');


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
    var newGateway = req.body.data;
    newGateway = { ...newGateway, usn: v1() }
    client.connect().then(async () => {
        collection.insertOne(newGateway, (err, result) => {
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

export default router;
