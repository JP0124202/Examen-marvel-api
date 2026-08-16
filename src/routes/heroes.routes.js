const express = require('express');
const router = express.Router();
const heroesController = require('../controllers/heroes.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/', authMiddleware, heroesController.getAll);
router.get('/:id', authMiddleware, heroesController.getById);
router.post('/', authMiddleware, role(['ADMIN']), heroesController.create);
router.put('/:id', authMiddleware, role(['ADMIN']), heroesController.update);
router.delete('/:id', authMiddleware, role(['ADMIN']), heroesController.remove);

module.exports = router;
