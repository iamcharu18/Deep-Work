const express = require('express');
const router = express.Router();

const index_controller = require('../controllers/index');

router.get('/', index_controller.index);

router.get('/about', index_controller.about);

router.get('/contact', index_controller.contact);

router.post('/sendmail', index_controller.sendmail);

router.post('/sendmail-2', index_controller.sendmail2);

router.get('/blogs', index_controller.blogs);

router.get('/blog/:urlSlug', index_controller.detailed_blog);

module.exports = router;