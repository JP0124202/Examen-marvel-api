const express = require('express');
const router = express.Router();
const misionesController = require('../controllers/misiones.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/', authMiddleware, misionesController.getAll);
router.get('/:id', authMiddleware, misionesController.getById);
router.post('/', authMiddleware, role(['ADMIN']), misionesController.create);
router.put('/:id', authMiddleware, role(['ADMIN']), misionesController.update);
router.delete('/:id', authMiddleware, role(['ADMIN']), misionesController.remove);

module.exports = router;
