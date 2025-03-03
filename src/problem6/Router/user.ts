import express from 'express'

import { UserScoreRepository } from '../UserScore/repositories/userScore.repository'
import { UserRepository } from '../User/repositories/user.repository'
import { authenticateToken } from '../../middlewares/authenticate'
import UserController from '../User/controllers/user.controller'
import UserValidation from '../User/validators/user.validation'
import UserService from '../User/services/user.service'
import { Validator } from '../../middlewares/validator'

const router = express.Router()
const userService = new UserService(UserRepository, UserScoreRepository)
const userController = new UserController(userService)
router.post("/login", Validator(UserValidation.login), userController.login)
router.post("/user", Validator(UserValidation.createUser), userController.createUser)
router.get("/user/top-ten", authenticateToken, userController.getTopTenUsers)
// router.get("/product", productController.getProductDetail)
// router.get("/products", productController.getListProducts)
// router.put("/product/:id", Validator(ProductValidation.updateProduct), productController.updateProduct)
// router.delete("/product/:id", productController.deleteProduct)

export default router