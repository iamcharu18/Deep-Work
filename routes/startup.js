const express = require('express');
const router = express.Router();

const startup_controller = require('../controllers/startup');

router.get('/:slug', startup_controller.slug);

module.exports = router;