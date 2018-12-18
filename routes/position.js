const express = require('express')
const positionController = require('../controllers/position')
const fileuploadMiddleware = require('../middlewares/fileupload')
const userAuthMiddleware = require('../middlewares/userauth')
const router = express.Router()

router.get('/listall',userAuthMiddleware.auth,positionController.listall)
router.get('/total',positionController.total)
router.post('/save',fileuploadMiddleware.fileupload,positionController.save)
router.post('/remove',positionController.remove)
router.post('/listone',positionController.listone)
router.post('/update',fileuploadMiddleware.fileupload,positionController.update)

module.exports = router