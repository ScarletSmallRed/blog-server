const mongoose = require("mongoose")
const { CONFIG } = require("./keys")

mongoose.connect(
  CONFIG.mongoDB.dbURI,
  {
      useNewUrlParser: true
  }
)
