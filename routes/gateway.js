import client from "../data/db.js";
import { ObjectID } from 'bson';
import express from 'express';
import { v1 } from 'uuid';
import { isIPv4 } from 'is-ip';

var router = express.Router();

const db = client.db();
const collection = db.collection('gateway');

/* GET gateways listing. */
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

router.get('/:id', (req, res, next) => {
    var myquery = { "_id": ObjectID(req.params.id) };
    client.connect().then(async () => {
        collection.find(myquery).toArray((err, result) => {
            if (err) throw err;
            res.status(200).send({ data: result });
        });
    })
});

router.put('/', (req, res, next) => {
    var newGateway = req.body.data;
    const { ipv4 } = req.body.data;
    if (ipv4 && !isIPv4(ipv4)) {
        res.status(400).send('Wrong ipv4 parameter');
        return;
    }
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
    const { ipv4 } = req.body.data;
    if (ipv4 && !isIPv4(ipv4)) {
        res.status(400).send('Wrong ipv4 parameter');
        return;
    }
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
