var express = require("express")
const expObj = express()

expObj.use(express.static(__dirname))

const config = require('config')
const environmentport = config.get('port');

var bodyparser = require("body-parser")
expObj.use(bodyparser.json())

const routes = require("./router")

expObj.get('/',function(res,req){
    req.sendFile(__dirname + "/tasks.html")
})

expObj.use("/lipt",routes)

const port = environmentport || 3333

expObj.listen(port,()=>{
    console.log(`express listing on port ${port}`)
})