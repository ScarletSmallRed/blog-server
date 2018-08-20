const Blog = require("./../models/blog")

exports.blog_create = (req, res, next) => {
  const blog = new Blog(req.body.blog)
  blog.save()
    .then(result => {
      res.status(201).json({
        message: "Handling POST requests to /blogs",
        createdBlog: result
      })
    })
    .catch(err => {
      res.status(500).json({
        err
      })
    })
}

exports.blog_get_all = (req, res, next) => {
  console.log("req session:", req.session)
  Blog.find()
    .select("_id title content")
    .then(docs => {
      res.status(200).json({
        docs
      })
    })
    .catch(err => {
      res.status(500).json({
        err
      })
    })
}

exports.blog_get_one = (req, res, next) => {
  const id = req.params.blogId
  Blog.findById(id)
    .select("id title content")
    .then(doc => {
      if (doc) {
        res.status(200).json({
          doc
        })
      } else {
        res.status(404).json({
          message: "No valid entry found for provided id"
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        err
      })
    })
}
