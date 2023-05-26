const express = require('express');
const router = express.Router();

const services_controller = require('../controllers/services');

router.get('/', services_controller.services);

router.get('/:slug', services_controller.individual_service);

module.exports = router;