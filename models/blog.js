const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  content: String,
  categories: Array,
  author: String
}, {
  timestamps: true
})

module.exports = mongoose.model("Blog", blogSchema)
