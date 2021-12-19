module.exports = require("express").Router()

.use("/Subscriber",require("./controller/subscriberController"))
.use("/Customer",require("./controller/customerController"))
.use("/Product",require("./controller/productController"))