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
  methods: "POST"
}
router.use(cors(CorsOptions))

module.exports = router

router.post("/insert", cors(), function (req, res) {
  getData(req.body.id)

  paramhash.put('product', JSON.stringify(getData(req.body.id)))

  var q = "product_details_insert"

  sqloperation.executeStoredProcedureWithParameters(q, paramhash).then(result => {
    if (result.rowsAffected) {
      res.status(200).send({ message: "Data inserted successfully." })
    }
    else {
      res.status(200).send({ message: "Try again" })
    }
  }).catch((err) => {
    console.log(err);
    res.status(400).send(err)
  });
})

async function getData(id) {
  const data = JSON.stringify({
    query: `{
            products(first: $id) {
              edges {
                node {
                  id
                  handle
                }
              }
              pageInfo {
                hasNextPage
              }
            }
          }`,
    variables: `{
          "id": "${id}"
        }`,
  });

  const response = await fetch(
    ' https://securecod4.myshopify.com/admin/api/2020-07/graphql.json',
    {
      method: 'post',
      body: data,
      headers: {
        'Content-Type': 'application/graphql',
        'X-Shopify-Access-Token': 'ZTM1MTljZThkMmI3Mjc1MDIxMDgwMGYzYmE3MTE1ZjI6YTg3NTIyY2MyZTI1NTFlNDM1NDlhY2ViNTJlNWQxNDE=',
      },
    }
  );

  const json = await response.json();
  return json.data;
}