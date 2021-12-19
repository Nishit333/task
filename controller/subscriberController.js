const express = require("express")
const bodyparser = require('body-parser');

const hashtable = require("simple-hashtable")
const paramhash = new hashtable()

const router = express.Router()
router.use(bodyparser.json())

const cors = require("cors")

const sqloperation = require('../sqloperation')

var CorsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    methods: "GET,POST,DELETE"
}
router.use(cors(CorsOptions))
module.exports = router

router.get("/list", cors(), function (req, res) {

    var q = "subscriber_details_list"

    sqloperation.executeStoredProcedure(q).then(result => {
        if (result.recordset) {
            res.status(200).send(result.recordset)
        }
        else {
            res.status(200).send({message : "Try again"})
        }
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err)
    });
})

router.post("/upsert", cors(), function (req, res) {

    paramhash.put('name',req.body.name)
        .put('gender',req.body.gender)
        .put('email_address',req.body.email_address)
        .put('mobile_number',req.body.mobile_number)
        .put('address_line1',req.body.address_line1)
        .put('address_line2',req.body.address_line2)
        .put('state',req.body.state)
        .put('city',req.body.city)
        .put('zipcode',req.body.zipcode)
        .put('country',req.body.country)

    var q = "subscriber_details_upsert"

    sqloperation.executeStoredProcedureWithParameters(q, paramhash).then(result => {
        if (result.rowsAffected) {
            res.status(200).send({message : "Registered successfully."})
        }
        else {
            res.status(200).send({message : "Try again"})
        }
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err)
    });
})

router.delete("/delete", cors(), function (req, res) {

    paramhash.put('subscriber_id',req.body.subscriber_id)

    var q = "subscriber_details_delete"

    sqloperation.executeStoredProcedureWithParameters(q, paramhash).then(result => {
        if (result.rowsAffected) {
            res.status(200).send({message : "Deleted successfully."})
        }
        else {
            res.status(200).send({message : "Try again"})
        }
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err)
    });
})