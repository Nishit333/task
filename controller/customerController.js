const express = require("express")
const bodyparser = require('body-parser');

const hashtable = require("simple-hashtable")
const paramhash = new hashtable()

const router = express.Router()
router.use(bodyparser.json())

const cors = require("cors")

const request = require('request')

const sqloperation = require('../sqloperation')

var CorsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    methods: "GET"
}
router.use(cors(CorsOptions))

module.exports = router

router.get("/insert", cors(), function (req, res) {
    api_call('https://e3519ce8d2b72750210800f3ba7115f2:a87522cc2e2551e43549aceb52e5d141@securecod4.myshopify.com/admin/api/2020-01/customers.json')
        .then(response => {


            paramhash.put('customers', JSON.stringify(response.customers))

            var q = "customer_detail_insert"

            sqloperation.executeStoredProcedureWithParameters(q, paramhash).then(result => {
                if (result.rowsAffected) {
                    var q1 = "customer_details_list"
                    sqloperation.executeStoredProcedure(q1).then(result => {
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
                }
                else {
                    res.status(200).send({ message: "Try again" })
                }
            }).catch((err) => {
                console.log(err);
                res.status(400).send(err)
            });

        })
        .catch(error => {
            res.send(error)
        })
})

function api_call(url) {
    return new Promise((resolve, reject) => {
        request(url, {
            json: true
        }, (err, res, body) => {
            if (err) reject(err)
            resolve(body)
        });
    })
}