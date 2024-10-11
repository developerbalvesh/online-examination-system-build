
const express = require('express');

const { requireSignIn, isAdmin } = require('../middleware/authMiddleware');
const { generateResultController, getResultController } = require('../controllers/resultsController');

const router = express.Router();

router.get('/generate/:id',requireSignIn, isAdmin, generateResultController);

router.get('/get-result/:id', getResultController)

module.exports = router;