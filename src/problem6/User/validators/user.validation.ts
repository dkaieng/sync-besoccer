import Joi from "joi"

const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const createUser = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    fullName: Joi.string().required(),
    nickName: Joi.string().required(),
    yearOld: Joi.string(),
    createdBy: Joi.string().required(),
    updatedBy: Joi.string().required(),
    role: Joi.string().valid('user', 'admin').required()
})

const UserValidation = { login, createUser }
export default UserValidation