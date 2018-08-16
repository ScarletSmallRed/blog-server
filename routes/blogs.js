const express = require('express');
const router = express.Router();
const blogController = require("./../controllers/blogs")

router.get("/", blogController.blog_get_all)
router.get("/:blogId", blogController.blog_get_one)
router.post("/", blogController.blog_create)

module.exports = router
