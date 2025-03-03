import express from 'express'

import { authenticateToken, authorizeRole } from '../../middlewares/authenticate'
import { ConfigRepository } from '../Config/repositories/config.repository'
import ConfigController from '../Config/controllers/config.controller'
import ConfigValidation from '../Config/validators/config.validation'
import ConfigService from '../Config/services/config.service'
import { Validator } from '../../middlewares/validator'

const router = express.Router()
const configService = new ConfigService(ConfigRepository)
const configController = new ConfigController(configService)
router.post("/config", Validator(ConfigValidation.createConfig), authenticateToken, authorizeRole(['admin']), configController.createConfig)
router.put("/config/:id", Validator(ConfigValidation.updateConfig), authenticateToken, authorizeRole(['admin']), configController.updateConfig)

export default router